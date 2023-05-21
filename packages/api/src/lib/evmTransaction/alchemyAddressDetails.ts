import { Alchemy, Network } from "alchemy-sdk";

import {
  type EthAddressType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

import { env } from "../../../env.mjs";

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
  return nfts;
}
