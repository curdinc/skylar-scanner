import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  EthAddressSchema,
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema";

import { getViemClient } from "../lib/evmTransaction/client";
import {
  getUserOpInfoFromParentHash,
  getUserOpLogFromOpHash,
} from "../lib/evmTransaction/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  getUserOp: publicProcedure
    .meta({ openapi: { method: "GET", path: "/userOpInfo" } })
    .input(z.object({ txn: z.string(), chainId: EvmChainIdSchema }))
    .output(z.any())
    .query(async ({ input }) => {
      const searchQuery = input.txn;
      const chainId = input.chainId;

      const parsedUserOpEventLog = await getUserOpLogFromOpHash(
        searchQuery,
        chainId,
      );

      // get the origin hash
      const parentHash = parsedUserOpEventLog.transactionHash;

      const uopInfo = await getUserOpInfoFromParentHash(
        parentHash,
        chainId,
        parsedUserOpEventLog.args.sender,
        parsedUserOpEventLog.args.nonce,
        true,
      );

      // TODO: @ElasticBottle
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(
        JSON.stringify(
          uopInfo,
          (key, value) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
        ),
      );
    }),
  parseSearchQuery: publicProcedure
    .input(z.object({ query: z.string(), chainId: EvmChainIdSchema }))
    .mutation(async ({ input }) => {
      const { query } = input;
      const addressParse = EthAddressSchema.safeParse(query);
      const txnParse = EthHashSchema.safeParse(query);
      if (addressParse.success) {
        // TODO
      }
      if (txnParse.success) {
        const client = getViemClient(input.chainId);
        const txn = await client.getTransaction({ hash: txnParse.data });
        console.log("txn", txn);
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid search query",
      });
    }),
});
