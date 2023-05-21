import { type EvmChainIdType } from "@skylarScan/schema";

import { getUserOpInfoFromParentHash, getUserOpLogFromOpHash } from "./utils";

export async function getUserOp(chainId: EvmChainIdType, searchQuery: string) {
  const parsedUserOpEventLog = await getUserOpLogFromOpHash(
    searchQuery,
    chainId,
  );

  // get the origin hash
  const parentHash = parsedUserOpEventLog.transactionHash;

  const uopInfo = await getUserOpInfoFromParentHash(
    parentHash,
    chainId,
    parsedUserOpEventLog,
    true,
  );

  return uopInfo;
}
