import { TRPCError } from "@trpc/server";
import { decodeAbiParameters, type Log } from "viem";

import {
  userOpLogSchema,
  userOpSchema,
  type EthAddressType,
  type EthHashType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "./client";
import {
  ENTRY_POINT_CONTRACT_ADDRESSES,
  HANDLE_OPS_INPUT,
  SIGNATURES,
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
  sender: EthAddressType,
  nonce: bigint,
  moreInfo = false,
) => {
  // get the viem client
  const client = getViemClient(chainId);

  // get the tranaction details
  const txnView = await client.getTransaction({ hash: parentHash });

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
  const uop = uops.find((uop) => uop.sender === sender && uop.nonce === nonce);

  const targetUop = { beneficiary: beneficiary, ...uop };

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

export const getTokenAndNFTDataFromBundleHash = async (
  bundleHash: EthHashType,
  chainId: string,
) => {
  const client = getViemClient(chainId);
  const txnReceipt = await client.getTransactionReceipt({ hash: bundleHash });

  const logs = txnReceipt.logs;
  const rawArray = new Array<{
    userOpHash: EthHashType;
    logs: Log<bigint, number>[];
  }>();

  logs.forEach((log) => {
    const buf = new Array<Log<bigint, number>>();
    if (log.topics.length === 0) {
      return;
    }
    switch (log.topics[0]) {
      case SIGNATURES.USER_OPERATION: {
        if (log.topics.length < 2 || log.topics[1] === undefined) {
          console.error(
            "Should never reach here there must be a weir collision.",
          );
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unknown error: should not reach here",
          });
        }
        rawArray.push({
          userOpHash: log.topics[1],
          logs: [...buf],
        });
      }
      case SIGNATURES.TOKEN_TRANSFER: {
        buf.push(log);
        break;
      }
      case SIGNATURES.ERC721_TRANSFER: {
        buf.push(log);
        break;
      }
      case SIGNATURES.ERC1155_SINGLE_TRANSFER: {
        buf.push(log);
        break;
      }
      case SIGNATURES.ERC1155_MULTIPLE_TRANSFER: {
        buf.push(log);
        break;
      }
    }
  });
};

export function isEoaAddressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
