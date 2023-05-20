import { TRPCError } from "@trpc/server";
import { createPublicClient, http, type HttpTransport } from "viem";

import { env } from "../../../env.mjs";

// generate client for specific chain
export const getViemClient = (chainId: string) => {
  // TODO: Add other chains
  let transport: HttpTransport;
  switch (chainId) {
    case "1": {
      transport = http(`https://mainnet.infura.io/v3/${env.INFURA_KEY}`);
      break;
    }
    default: {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "invalid chain input",
        cause: "possibly unsupported",
      });
      break;
    }
  }
  const client = createPublicClient({
    transport: transport,
  });
  return client;
};
