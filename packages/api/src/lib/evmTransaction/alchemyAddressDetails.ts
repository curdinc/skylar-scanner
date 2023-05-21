import { Alchemy, Network } from "alchemy-sdk";
import { fromHex } from "viem";

import { OneInchSwapSchema } from "@skylarScan/schema";
import { NftDetailsSchema } from "@skylarScan/schema/src/addressDetails";
import {
  EthAddressSchema,
  EthHashSchema,
  type EthAddressType,
  type EthHashType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

import { env } from "../../../env.mjs";
import { getViemClient } from "./client";
import { swapToUsd } from "./oneInchExchange";

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
    if (token.tokenBalance) {
      const tokenAmount = fromHex(
        EthHashSchema.parse(token.tokenBalance),
        "bigint",
      );
      // don't query if we have less than this ($0.10 usdc)~ to prevent spamming api
      if (tokenAmount <= 100000n) {
        return;
      }
      try {
        const swapResult = await swapToUsd({
          amount: fromHex(EthHashSchema.parse(token.tokenBalance), "bigint"),
          contractAddress: EthAddressSchema.parse(token.contractAddress),
          chainId,
        });
        return swapResult;
      } catch (e) {
        console.error(e);
        return;
      }
    }
  });
  const tokens = OneInchSwapSchema.array().parse(
    (await Promise.all(balances)).filter((token) => token !== undefined),
  );
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

export async function getAddressDetails(
  address: EthAddressType,
  chainId: EvmChainIdType,
) {
  let byteCode: EthHashType | undefined;
  try {
    const client = getViemClient(chainId);
    byteCode = await client.getBytecode({
      address,
    });
  } catch (e) {
    console.error("ERROR: fetching bytecode from viem client: ", e);
  }

  try {
    const ensClient = getViemClient("1");
    const ensName = await ensClient.getEnsName({
      address,
    });
    if (!ensName) {
      return { byteCode };
    }
    const ensAvatar = await ensClient.getEnsAvatar({
      name: ensName,
    });
    return { ensName, ensAvatar, byteCode };
  } catch (e) {
    console.error(
      "ERROR: fetching ensName and ensAvatar from viem client: ",
      e,
    );
    return { byteCode };
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
