import { TRPCError } from "@trpc/server";

import { userOpLogSchema } from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "./client";
import { ENTRYPOINT_CONTRACT_ADDRESS, USER_OPERATION_EVENT } from "./constants";

// params should already should be validated before called so we just crash
export const getUserOpFromHash = async (opHash: string, chainId: string) => {
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
export function isEoaAddressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
