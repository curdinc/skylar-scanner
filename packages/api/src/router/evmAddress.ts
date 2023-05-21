import { EvmAddressTokensAndNftsQuerySchema } from "@skylarScan/schema";

import {
  getAddressDetails,
  getAddressNfts,
  getAddressTokens,
} from "../lib/evmTransaction/alchemyAddressDetails";
import { getViemClient } from "../lib/evmTransaction/client";
import { swapToUsd } from "../lib/evmTransaction/oneInchExchange";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmAddressRouter = createTRPCRouter({
  addressDetails: publicProcedure
    .input(EvmAddressTokensAndNftsQuerySchema)
    .query(async ({ input }) => {
      const { address, chainId } = input;
      const addressDetails = await getAddressDetails(address, chainId);
      return addressDetails;
    }),
  tokens: publicProcedure
    .input(EvmAddressTokensAndNftsQuerySchema)
    .query(async ({ input }) => {
      const { chainId, address } = input;
      const tokens = await getAddressTokens(address, chainId);
      const client = getViemClient(chainId);
      const ethBalance = await client.getBalance({ address });
      const ethBalanceInUsd = await swapToUsd({
        amount: ethBalance,
        chainId,
        contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      });
      return [ethBalanceInUsd, ...tokens];
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
