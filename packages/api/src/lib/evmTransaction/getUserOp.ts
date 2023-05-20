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
    parsedUserOpEventLog.args.sender,
    parsedUserOpEventLog.args.nonce,
    true,
  );

  // TODO: @ElasticBottle
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(
    JSON.stringify(
      uopInfo,
      (key, value) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
    ),
  );
}
