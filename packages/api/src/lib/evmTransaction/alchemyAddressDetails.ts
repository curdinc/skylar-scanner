import { Alchemy, Network } from "alchemy-sdk";

import { NftDetailsSchema } from "@skylarScan/schema/src/addressDetails";
import {
  type EthAddressType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

import { env } from "../../../env.mjs";
import { getViemClient } from "./client";

const networkToChainId: Record<EvmChainIdType, Network> = {
  1: Network.ETH_MAINNET,
  5: Network.ETH_GOERLI,
  137: Network.MATIC_MAINNET,
  80001: Network.MATIC_MUMBAI,
};
export async function getAddressTokens(
  address: EthAddressType,
  chainId: EvmChainIdType,
) {
  const config = {
    apiKey: env.ALCHEMY_KEY,
    network: networkToChainId[chainId],
  };
  const alchemy = new Alchemy(config);
  const alchemyBalances = await alchemy.core.getTokenBalances(address);
  const balances = alchemyBalances.tokenBalances.map(async (token) => {
    return token;
  });
  const tokens = await Promise.all(balances);
  return tokens;
}

export async function getAddressNfts(
  address: EthAddressType,
  chainId: EvmChainIdType,
) {
  const config = {
    apiKey: env.ALCHEMY_KEY,
    network: networkToChainId[chainId],
  };
  const alchemy = new Alchemy(config);
  const _nfts = await alchemy.nft.getNftsForOwner(address);
  const nfts = { ..._nfts };
  let moreNfts = { ...nfts };
  if (moreNfts.pageKey) {
    moreNfts = await alchemy.nft.getNftsForOwner(address, {
      pageKey: moreNfts.pageKey,
    });
    nfts.totalCount += moreNfts.totalCount;
    nfts.ownedNfts = nfts.ownedNfts.concat(moreNfts.ownedNfts);
  }
  return {
    totalCount: nfts.totalCount,
    ownedNfts: nfts.ownedNfts
      .map((nft) => {
        const parsedNft = NftDetailsSchema.safeParse(nft);
        if (!parsedNft.success) {
          console.log("nft", nft.media);
          console.error(
            "ERROR: parsing nft: ",
            JSON.stringify(parsedNft.error.format()),
          );
          return;
        }

        return parsedNft.data;
      })
      .filter((nft) => !!nft),
  };
}

export async function getAddressDetails(address: EthAddressType) {
  const client = getViemClient("1");
  try {
    const ensName = await client.getEnsName({
      address,
    });
    if (!ensName) {
      return;
    }
    const ensAvatar = await client.getEnsAvatar({
      name: ensName,
    });
    return { ensName, ensAvatar };
  } catch (e) {
    console.error(
      "ERROR: fetching ensName and ensAvatar from viem client: ",
      e,
    );
    return;
  }
}

// NOT FREE :'(
// export async function getTransactionTraces(
//   txnHash: EthHashType,
//   chainId: EvmChainIdType,
// ) {
//   const config = {
//     apiKey: env.ALCHEMY_KEY,
//     network: networkToChainId[chainId],
//   };
//   const alchemy = new Alchemy(config);
//   const traces = await alchemy.debug.traceTransaction(txnHash, {
//     type: DebugTracerType.CALL_TRACER,
//     onlyTopCall: false,
//   });

//   console.log(traces);
//   return "";
// }
