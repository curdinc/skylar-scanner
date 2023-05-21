import { TRPCError } from "@trpc/server";
import { ethers } from "ethers";
import { decodeAbiParameters, formatGwei, formatUnits, fromHex } from "viem";
import { z } from "zod";

import {
  BytesSchema,
  EthAddressSchema,
  userOpLogSchema,
  userOpSchema,
  type EthHashType,
  type EvmChainIdType,
  type NftType,
  type TokenType,
  type userOpLogType,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "./client";
import {
  ENTRY_POINT_CONTRACT_ADDRESSES,
  PARSER_ABI,
  SIGNATURES,
  USER_OPERATION_EVENT,
} from "./constants";
import { swapToUsd } from "./oneInchExchange";

const bigNumberToBigInt = (bigNum: ethers.BigNumber): bigint => {
  return BigInt(bigNum.toString());
};
// params should already should be validated before called so we just crash
export const getUserOpLogFromOpHash = async (
  opHash: string,
  chainId: EvmChainIdType,
) => {
  const client = getViemClient(chainId);
  const entryPointContract = ENTRY_POINT_CONTRACT_ADDRESSES[chainId][0];

  const filter = await client.createEventFilter({
    address: entryPointContract,
    event: USER_OPERATION_EVENT,
    args: [opHash],
    fromBlock: 0n,
  });

  const logs = await client.getFilterLogs({ filter });
  console.log("logs", logs);
  if (logs.length !== 1) {
    console.error("Hash not found or collides", logs);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "invalid length of transactions",
      cause: "Hash not found or collides",
    });
  }

  const zodParseUserOpEventLog = userOpLogSchema.safeParse(logs[0]);
  if (!zodParseUserOpEventLog.success) {
    console.error(logs[0]);
    console.error(zodParseUserOpEventLog.error.format());
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error occured parsing txn Inputs",
      cause: zodParseUserOpEventLog.error,
    });
  }
  const parsedUserOpEventLog = zodParseUserOpEventLog.data;

  if (parsedUserOpEventLog === undefined) {
    console.error("should never reach here");
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occured.",
      cause: "Log in undefined.",
    });
  }

  return parsedUserOpEventLog;
};

export const parseBundleInput = (input: string) => {
  let ethersParsedInput: ethers.utils.Result;
  try {
    ethersParsedInput = new ethers.utils.Interface([
      "function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] ops, address beneficiary)",
    ]).decodeFunctionData("handleOps", input);
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid epc func sign.",
      cause: e,
    });
  }
  console.log("ethersParsedInput", ethersParsedInput);
  const data = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    uops: ethersParsedInput[0].map((op) => {
      const parsedOp = {
        sender: EthAddressSchema.parse(op[0]),
        nonce: z.bigint().parse(bigNumberToBigInt(op[1])),
        initCode: BytesSchema.parse(op[2]),
        callData: BytesSchema.parse(op[3]),
        callGasLimit: z.bigint().parse(bigNumberToBigInt(op[4])),
        verificationGasLimit: z.bigint().parse(bigNumberToBigInt(op[5])),
        preVerificationGas: z.bigint().parse(bigNumberToBigInt(op[6])),
        maxFeePerGas: z.bigint().parse(bigNumberToBigInt(op[7])),
        maxPriorityFeePerGas: z.bigint().parse(bigNumberToBigInt(op[8])),
        paymasterAndData: BytesSchema.parse(op[9]),
        signature: BytesSchema.parse(op[10]),
      };
      return parsedOp;
    }),
    beneficiary: EthAddressSchema.parse(ethersParsedInput[1]),
  };
  return data;
};
export const getUserOpInfoFromParentHash = async (
  parentHash: EthHashType,
  chainId: EvmChainIdType,
  userOpLog: userOpLogType,
) => {
  // get the viem client
  const client = getViemClient(chainId);

  // get the tranaction details
  const txnView = await client.getTransaction({ hash: parentHash });
  const txnReceipt = await client.getTransactionReceipt({ hash: parentHash });
  const block = await client.getBlock({
    blockNumber: txnReceipt.blockNumber,
  });

  const parentTxnInput = parseBundleInput(txnView.input);

  // get params
  const uops = parentTxnInput.uops;
  const beneficiary = parentTxnInput.beneficiary;

  // find targetUop with unique compound key (sender, nonce)
  const {
    args: { actualGasCost, sender, nonce, userOpHash, actualGasUsed },
  } = userOpLog;
  const uop = uops.find((uop) => uop.sender === sender && uop.nonce === nonce);

  const gasPrice = actualGasCost / actualGasUsed;
  const usdcSwapDetails = await swapToUsd({
    chainId,
    amount: actualGasCost,
    contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  });
  const transactionCost = formatUnits(
    usdcSwapDetails.toTokenAmount,
    usdcSwapDetails.toToken.decimals,
  );
  const targetUop = {
    sender,
    bundleHash: parentHash,
    beneficiary: beneficiary,
    timestamp: new Date(Number(block.timestamp * 1000n)),
    transactionCost: transactionCost.toString(),
    entryPointContract: txnReceipt.to,
    userOpHash,
    parsedUserOp: uop,
    rawUserOp: txnView.input,
    gasData: {
      gasUsed: actualGasUsed.toString(),
      gasLimit: (
        (uop?.callGasLimit || 0n) +
          (uop?.verificationGasLimit || 0n) +
          (uop?.preVerificationGas || 0n) || actualGasUsed
      ).toString(),
      gasPrice: formatGwei(gasPrice),
      baseFeePerGas: formatGwei(gasPrice - (uop?.maxPriorityFeePerGas || 0n)),
      tipFeePerGas: formatGwei(uop?.maxPriorityFeePerGas || 0n),
      maxFeePerGas: formatGwei(uop?.maxFeePerGas || 0n),
    },
  };

  const zodParsedTargetUop = userOpSchema.safeParse(targetUop);

  if (!zodParsedTargetUop.success) {
    console.error(targetUop);
    console.error(zodParsedTargetUop.error.format());
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error occured parsing txn Inputs",
      cause: zodParsedTargetUop.error,
    });
  }
  console.log("zodParsedTargetUop.data", zodParsedTargetUop.data);
  return zodParsedTargetUop.data;
};

export const getTokenAndNFTDataFromBundleHash = async (
  bundleHash: string,
  chainId: EvmChainIdType,
) => {
  const client = getViemClient(chainId);
  const txnReceipt = await client.getTransactionReceipt({
    hash: bundleHash as any,
  });

  const logs = txnReceipt.logs;
  const returnArray = new Array<{
    userOpHash: EthHashType;
    tokens: TokenType[];
    nfts: NftType[];
  }>();

  const tokenBuf = new Array<TokenType>();
  const nftBuf = new Array<NftType>();

  for (const log of logs) {
    if (log.topics.length === 0) {
      continue;
    }
    switch (log.topics[0]) {
      case SIGNATURES.USER_OPERATION: {
        if (log.topics.length < 2 || log.topics[1] === undefined) {
          console.error(
            "Should never reach here there must be a weird collision.",
          );
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unknown error: should not reach here",
          });
        }
        returnArray.push({
          userOpHash: log.topics[1],
          tokens: [...tokenBuf],
          nfts: [...nftBuf],
        });
        tokenBuf.splice(0);
        nftBuf.splice(0);
      }
      case SIGNATURES.ERC721_TRANSFER_OR_ERC20_TRANSFER: {
        // Check whether it is an ERC20 or ERC721
        try {
          const decs = await client.readContract({
            address: log.address,
            abi: PARSER_ABI,
            functionName: "decimals",
          });
          // we have an ERC20
          const from: `0x${string}` = `0x${log.topics[1]?.slice(-40)}`;
          const to: `0x${string}` = `0x${log.topics[2]?.slice(-40)}`;

          console.log(from, to);

          const tokenLog = {
            amount: fromHex(log.data, "bigint"),
            contract: log.address,
            decimals: decs,
            from: from,
            name: "noNameYetWinstonWillFix",
            to: to,
            type: "erc20",
          } satisfies TokenType;
          tokenBuf.push(tokenLog);
        } catch {
          //Assume this is an ERC721
          const from: `0x${string}` = `0x${log.topics[1]?.slice(-40)}`;
          const to: `0x${string}` = `0x${log.topics[2]?.slice(-40)}`;
          const tokenId = log.topics[3];

          if (tokenId === undefined) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Invalid tokenId",
            });
          }
          const nftLog: NftType = {
            amount: 1n,
            contract: log.address,
            from: from,
            imageUrl: "noURLYetWinstonOrHansWillFix",
            name: "noNameYetWinstonWillFix",
            to: to,
            tokenId: fromHex(tokenId, "bigint"),
            type: "erc721",
          };
          nftBuf.push(nftLog);
        }
        break;
      }
      case SIGNATURES.ERC1155_SINGLE_TRANSFER: {
        const from: `0x${string}` = `0x${log.topics[2]?.slice(-40)}`;
        const to: `0x${string}` = `0x${log.topics[3]?.slice(-40)}`;

        const [id] = decodeAbiParameters(
          [
            { name: "id", type: "uint" },
            { name: "value", type: "uint" },
          ],
          log.data,
        );

        const nftLog: NftType = {
          amount: 1n,
          contract: log.address,
          from: from,
          imageUrl: "noURLYetWinstonOrHansWillFix",
          name: "noNameYetWinstonWillFix",
          to: to,
          tokenId: id,
          type: "erc1155",
        };
        nftBuf.push(nftLog);
        break;
      }
      case SIGNATURES.ERC1155_MULTIPLE_TRANSFER: {
        const from: `0x${string}` = `0x${log.topics[2]?.slice(-40)}`;
        const to: `0x${string}` = `0x${log.topics[3]?.slice(-40)}`;

        const [ids, values] = decodeAbiParameters(
          [
            { name: "ids", type: "uint[]" },
            { name: "values", type: "uint[]" },
          ],
          log.data,
        );

        const nftLog: NftType[] = ids.map((id, iter): NftType => {
          const amt = values[iter];
          if (amt === undefined) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Invalid NFT",
            });
          }
          return {
            amount: amt,
            contract: log.address,
            from: from,
            imageUrl: "noURLYetWinstonOrHansWillFix",
            name: "noNameYetWinstonWillFix",
            to: to,
            tokenId: id,
            type: "erc1155",
          };
        });
        nftBuf.push(...nftLog);
        break;
      }
    }
  }
  if (returnArray.length === 0) {
    // not a handle ops
    returnArray.push({
      userOpHash: "0x",
      tokens: [...tokenBuf],
      nfts: [...nftBuf],
    });
  }
  return returnArray;
};

export function isEoaAddressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
