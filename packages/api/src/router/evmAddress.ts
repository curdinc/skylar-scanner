import { EvmAddressTokensAndNftsQuerySchema } from "@skylarScan/schema";

import {
  getAddressNfts,
  getAddressTokens,
} from "../lib/evmTransaction/alchemyAddressDetails";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmAddressRouter = createTRPCRouter({
  addressTokensAndNfts: publicProcedure
    .input(EvmAddressTokensAndNftsQuerySchema)
    .query(async ({ input }) => {
      const { chainId, address } = input;
      const tokens = await getAddressTokens(address, chainId);
      const nfts = await getAddressNfts(address, chainId);
      return { nfts, tokens };
    }),
});
