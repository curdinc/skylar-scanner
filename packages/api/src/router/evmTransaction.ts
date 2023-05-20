import { z } from "zod";

import { EvmChainIdSchema } from "@skylarScan/schema";

import { getUserOp } from "../lib/evmTransaction/getUserOp";
import { parseEvmInput } from "../lib/evmTransaction/parseEvmInput";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  userOpInfo: publicProcedure
    .meta({ openapi: { method: "GET", path: "/userOpInfo" } })
    .input(z.object({ txn: z.string(), chainId: EvmChainIdSchema }))
    .output(z.any())
    .query(async ({ input }) => {
      const { chainId, txn: searchQuery } = input;
      return getUserOp(chainId, searchQuery);
    }),
  parseSearchQuery: publicProcedure
    .input(z.object({ query: z.string(), chainId: EvmChainIdSchema }))
    .mutation(async ({ input }) => {
      const { query, chainId } = input;
      return parseEvmInput(query, chainId);
    }),
});
