import { TRPCError } from "@trpc/server";
import { createPublicClient, http, type HttpTransport } from "viem";

import { type EvmChainIdType } from "@skylarScan/schema";

import { env } from "../../../env.mjs";

// generate client for specific chain
export const getViemClient = (chainId: EvmChainIdType) => {
  let transport: HttpTransport;
  switch (chainId) {
    case "1": {
      transport = http(`https://mainnet.infura.io/v3/${env.INFURA_KEY}`);
      break;
    }
    case "5": {
      transport = http(`https://goerli.infura.io/v3/${env.INFURA_KEY}`);
      break;
    }
    case "137": {
      transport = http(
        `https://polygon-mainnet.infura.io/v3/${env.INFURA_KEY}`,
      );
      break;
    }
    case "80001": {
      transport = http(`https://polygon-mumbai.infura.io/v3/${env.INFURA_KEY}`);
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
    transport: transport,
  });
  return client;
};
