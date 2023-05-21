import { type EvmChainIdType } from "@skylarScan/schema";

import {
  getTokenAndNFTDataFromBundleHash,
  getUserOpInfoFromParentHash,
  getUserOpLogFromOpHash,
  isEoaAddressEqual,
} from "./utils";

export async function getUserOp(
  chainId: EvmChainIdType,
  searchQuery: string,
  moreInfo = false,
) {
  console.log("startGetUOP");

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
  );

  if (moreInfo) {
    const tokenAndNFTData = await getTokenAndNFTDataFromBundleHash(
      parentHash,
      chainId,
    );

    console.log("tokenAndNFTData", tokenAndNFTData);

    const targetData = tokenAndNFTData.find((payload) => {
      return isEoaAddressEqual(payload.userOpHash, searchQuery);
    });
    return { ...uopInfo, ...targetData };
  }

  return uopInfo;
}
