import { TRPCError } from "@trpc/server";
import { createPublicClient, fallback, http, type HttpTransport } from "viem";
import { goerli, mainnet, polygon, polygonMumbai } from "viem/chains";

import { type EvmChainIdType } from "@skylar-scanner/schema";

import { env } from "../../../env.mjs";

const chainIdToChain = {
  1: mainnet,
  5: goerli,
  137: polygon,
  80001: polygonMumbai,
};
// generate client for specific chain
export const getViemClient = (chainId: EvmChainIdType) => {
  let infura: HttpTransport;
  let alchemy: HttpTransport;
  switch (chainId) {
    case "1": {
      infura = http(`https://mainnet.infura.io/v3/${env.INFURA_KEY}`);
      alchemy = http(`https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_KEY}`);
      break;
    }
    case "5": {
      infura = http(`https://goerli.infura.io/v3/${env.INFURA_KEY}`);
      alchemy = http(`https://eth-goerli.g.alchemy.com/v2/${env.ALCHEMY_KEY}`);
      break;
    }
    case "137": {
      infura = http(`https://polygon-mainnet.infura.io/v3/${env.INFURA_KEY}`);
      alchemy = http(
        `https://polygon-mainnet.g.alchemy.com/v2/${env.ALCHEMY_KEY}`,
      );
      break;
    }
    case "80001": {
      infura = http(`https://polygon-mumbai.infura.io/v3/${env.INFURA_KEY}`);
      alchemy = http(
        `https://polygon-mumbai.g.alchemy.com/v2/${env.ALCHEMY_KEY}`,
      );
      break;
    }
    default: {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "invalid chain input",
        cause: "possibly unsupported",
      });
    }
  }

  const client = createPublicClient({
    chain: chainIdToChain[chainId],
    transport: fallback([infura, alchemy]),
  });
  return client;
};
