import { z } from "zod";

import { EvmChainIdSchema } from "@skylarScan/schema";

import { parseEvmInput } from "../lib/evmTransaction/parseEvmInput";
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
      const { query, chainId } = input;
      return parseEvmInput(query, chainId);
    }),
});
