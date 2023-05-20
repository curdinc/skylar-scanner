import { TRPCError } from "@trpc/server";
import { decodeAbiParameters } from "viem";
import { z } from "zod";

import {
  EthAddressSchema,
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema";
import { userOpSchema } from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "../lib/evmTransaction/client";
import { HANDLE_OPS_INPUT } from "../lib/evmTransaction/constants";
import { getUserOpFromHash } from "../lib/evmTransaction/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  getUserOp: publicProcedure
    .meta({ openapi: { method: "GET", path: "/userOpInfo" } })
    .input(z.object({ txn: z.string(), chainId: EvmChainIdSchema }))
    .output(z.any())
    .query(async ({ input }) => {
      const searchQuery = input.txn;
      const chainId = input.chainId;

      // get the viem client
      const client = getViemClient(chainId);

      const parsedUserOpEventLog = await getUserOpFromHash(
        searchQuery,
        chainId,
      );

      const parentHash = parsedUserOpEventLog.transactionHash;

      if (!parentHash) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "parentHash not defined",
          cause: "unknown",
        });
      }

      const txnView = await client.getTransaction({ hash: parentHash });

      const parsedInp: `0x${string}` = `0x${txnView.input.slice(10)}`;

      const parentTxnInput = decodeAbiParameters(HANDLE_OPS_INPUT, parsedInp);

      if (parentTxnInput.length !== 2) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown Error Occured",
          cause: "txnInput decoding error",
        });
      }

      // get params
      const uops = parentTxnInput[0];
      const beneficiary = parentTxnInput[1];

      // find targetUop with unique compound key (sender, nonce)
      const uop = uops.find(
        (uop) =>
          uop.sender === parsedUserOpEventLog.args.sender &&
          uop.nonce === parsedUserOpEventLog.args.nonce,
      );

      const targetUop = { beneficiary: beneficiary, ...uop };

      const zodParsedTargetUop = userOpSchema.safeParse(targetUop);

      if (!zodParsedTargetUop.success) {
        console.error(targetUop);
        console.error(zodParsedTargetUop.error.format());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error occured parsing txn Inputs",
          cause: zodParsedTargetUop.error,
        });
      }

      // TODO: @ElasticBottle
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(
        JSON.stringify(
          zodParsedTargetUop.data,
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
