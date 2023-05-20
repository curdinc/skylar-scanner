import { EvmTransactionQuerySchema } from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "../lib/evmTransaction/client";
import { getUserOp } from "../lib/evmTransaction/getUserOp";
import { parseEvmInput } from "../lib/evmTransaction/parseEvmInput";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  userOpInfo: publicProcedure
    .meta({ openapi: { method: "GET", path: "/userOpInfo" } })
    .input(EvmTransactionQuerySchema)
    .query(async ({ input }) => {
      const { chainId, txnHash: searchQuery } = input;
      return getUserOp(chainId, searchQuery);
    }),
  transactionInfo: publicProcedure
    .input(EvmTransactionQuerySchema)
    .query(async ({ input }) => {
      const { chainId, txnHash } = input;
      const client = getViemClient(chainId);
      const txn = await client.getTransaction({ hash: txnHash });
      return txn;
    }),

  parseSearchQuery: publicProcedure
    .input(EvmTransactionQuerySchema)
    .mutation(async ({ input }) => {
      const { txnHash, chainId } = input;
      return parseEvmInput(txnHash, chainId);
    }),
});
