import { EvmParseQuerySchema } from "@skylarScan/schema/src/addressDetails";
import {
  EthHashSchema,
  EvmTransactionQuerySchema,
  userOpInfoPayloadSchema,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "../lib/evmTransaction/client";
import { getUserOp } from "../lib/evmTransaction/getUserOp";
import { parseEvmInput } from "../lib/evmTransaction/parseEvmInput";
import { getTokenAndNFTDataFromBundleHash } from "../lib/evmTransaction/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  userOpInfo: publicProcedure
    .meta({ openapi: { method: "GET", path: "/userOpInfo" } })
    .input(EvmTransactionQuerySchema)
    .query(async ({ input }) => {
      const { chainId, txnHash: searchQuery } = input;
      const res = await getUserOp(chainId, searchQuery, true);
      return res;
    }),

  transactionRecognizedInfo: publicProcedure
    .meta({ openapi: { method: "GET", path: "/transactionRecognizedInfo" } })
    .input(EvmTransactionQuerySchema)
    .output(userOpInfoPayloadSchema.array())
    .query(async ({ input }) => {
      const { chainId, txnHash } = input;
      const zodParsedTxnHash = EthHashSchema.parse(txnHash);
      const data = await getTokenAndNFTDataFromBundleHash(
        zodParsedTxnHash,
        chainId,
      );
      const zodParsed = userOpInfoPayloadSchema.array().safeParse(data);
      if (!zodParsed.success) {
        console.error(
          JSON.stringify(zodParsed.error.format()[0]?.tokens, null, 2),
        );
      }
      console.log(zodParsed);
      return data;
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
