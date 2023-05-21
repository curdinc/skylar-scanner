import { z } from "zod";

import { EvmParseQuerySchema } from "@skylarScan/schema/src/addressDetails";
import {
  EthHashSchema,
  EvmTransactionQuerySchema,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "../lib/evmTransaction/client";
import { getUserOp } from "../lib/evmTransaction/getUserOp";
import { parseEvmInput } from "../lib/evmTransaction/parseEvmInput";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  userOpInfo: publicProcedure
    .meta({ openapi: { method: "GET", path: "/userOpInfo" } })
    .input(EvmTransactionQuerySchema)
    .output(z.any())
    .query(async ({ input }) => {
      const { chainId, txnHash: searchQuery } = input;
      return getUserOp(chainId, searchQuery);
    }),
  transactionInfo: publicProcedure
    .input(EvmTransactionQuerySchema)
    .query(async ({ input }) => {
      const { chainId, txnHash } = input;
      const client = getViemClient(chainId);
      const txn = await client.getTransaction({
        hash: EthHashSchema.parse(txnHash),
      });
      return txn;
    }),

  parseSearchQuery: publicProcedure
    .input(EvmParseQuerySchema)
    .mutation(async ({ input }) => {
      const { query, chainId } = input;
      return parseEvmInput(query, chainId);
    }),
});
