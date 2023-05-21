import { TRPCError } from "@trpc/server";
import { decodeAbiParameters, formatEther, formatGwei } from "viem";

import {
  userOpLogSchema,
  userOpSchema,
  type EthHashType,
  type EvmChainIdType,
  type userOpLogType,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "./client";
import {
  ENTRY_POINT_CONTRACT_ADDRESSES,
  HANDLE_OPS_INPUT,
  USER_OPERATION_EVENT,
} from "./constants";

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

export const getUserOpInfoFromParentHash = async (
  parentHash: EthHashType,
  chainId: EvmChainIdType,
  userOpLog: userOpLogType,
  moreInfo = false,
) => {
  // get the viem client
  const client = getViemClient(chainId);

  // get the tranaction details
  const txnView = await client.getTransaction({ hash: parentHash });
  const txnReceipt = await client.getTransactionReceipt({ hash: parentHash });
  const block = await client.getBlock({
    blockNumber: txnReceipt.blockNumber,
  });

  const parsedInp: `0x${string}` = `0x${txnView.input.slice(10)}`;

  const parentTxnInput = decodeAbiParameters(HANDLE_OPS_INPUT, parsedInp);

  if (parentTxnInput.length !== 2) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unknown Error Occured",
      cause: "txnInput decoding error",
    });
  }

  // get params
  const uops = parentTxnInput[0];
  const beneficiary = parentTxnInput[1];

  // find targetUop with unique compound key (sender, nonce)
  const {
    args: { actualGasCost, sender, nonce, userOpHash, actualGasUsed },
  } = userOpLog;
  const uop = uops.find((uop) => uop.sender === sender && uop.nonce === nonce);

  const gasPrice = actualGasCost / actualGasUsed;
  const targetUop = {
    beneficiary: beneficiary,
    timestamp: new Date(Number(block.timestamp * 1000n)),
    transactionCost: formatEther(actualGasCost),
    entryPointContract: txnReceipt.to,
    userOpHash,
    parsedUserOp: uop,
    rawUserOp: parsedInp,
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
  return zodParsedTargetUop.data;
};

export function isEoaAddressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
