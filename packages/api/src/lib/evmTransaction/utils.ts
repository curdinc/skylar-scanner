import { TRPCError } from "@trpc/server";
import { decodeAbiParameters } from "viem";

import {
  userOpLogSchema,
  userOpSchema,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "./client";
import {
  ENTRYPOINT_CONTRACT_ADDRESS,
  HANDLE_OPS_INPUT,
  USER_OPERATION_EVENT,
} from "./constants";

// params should already should be validated before called so we just crash
export const getUserOpLogFromOpHash = async (
  opHash: string,
  chainId: string,
) => {
  const client = getViemClient(chainId);

  const filter = await client.createEventFilter({
    address: ENTRYPOINT_CONTRACT_ADDRESS,
    event: USER_OPERATION_EVENT,
    args: [opHash],
    fromBlock: 17296100n,
  });

  const logs = await client.getFilterLogs({ filter });

  if (logs.length !== 1) {
    console.error("Hash not found or collides");
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
  parentHash: string,
  chainId: string,
  sender: string,
  nonce: bigint,
  moreInfo: boolean,
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

export function isEoaAddressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
