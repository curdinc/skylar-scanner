import { z } from "zod";

import {
  EthAddressSchema,
  EvmAddressTokensAndNftsQuerySchema,
} from "@skylarScan/schema";

import {
  getAddressDetails,
  getAddressNfts,
  getAddressTokens,
} from "../lib/evmTransaction/alchemyAddressDetails";
import { getViemClient } from "../lib/evmTransaction/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmAddressRouter = createTRPCRouter({
  addressDetails: publicProcedure
    .input(
      z.object({
        address: EthAddressSchema,
      }),
    )
    .query(async ({ input }) => {
      const { address } = input;
      const addressDetails = await getAddressDetails(address);
      return { addressDetails };
    }),
  tokens: publicProcedure
    .input(EvmAddressTokensAndNftsQuerySchema)
    .query(async ({ input }) => {
      const { chainId, address } = input;
      const tokens = await getAddressTokens(address, chainId);
      return { tokens };
    }),
  nfts: publicProcedure
    .input(EvmAddressTokensAndNftsQuerySchema)
    .query(async ({ input }) => {
      const { chainId, address } = input;
      const nfts = await getAddressNfts(address, chainId);
      return { nfts };
    }),
  transactions: publicProcedure
    .input(EvmAddressTokensAndNftsQuerySchema)
    .query(async ({ input }) => {
      const { chainId, address } = input;
      const client = getViemClient(chainId);

      const nfts = await getAddressNfts(address, chainId);
      return { nfts };
    }),
});
