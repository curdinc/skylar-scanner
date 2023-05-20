import { TRPCError } from "@trpc/server";
import { createPublicClient, decodeAbiParameters, http } from "viem";
import { z } from "zod";

import {
  EthAddressSchema,
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema";
import {
  userOpLogSchema,
  userOpSchema,
} from "@skylarScan/schema/src/evmTransaction.js";

import { env } from "../../env.mjs";
import { getViemClient } from "../lib/evmTransaction/client";
import {
  ENTRYPOINT_CONTRACT_ADDRESS,
  USER_OPERATION_EVENT,
  USER_OPERATION_INPUT,
} from "../lib/evmTransaction/constants";
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

      const filter = await client.createEventFilter({
        address: ENTRYPOINT_CONTRACT_ADDRESS,
        event: USER_OPERATION_EVENT,
        args: [searchQuery],
        fromBlock: 17296100n,
      });

      const logs = await client.getFilterLogs({ filter });

      if (logs.length !== 1) {
        console.error("Hash not found or collides");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "invalid length of transactions",
          cause: "Hash not found or collides",
        });
      }

      const zodParseUserOpEventLog = userOpLogSchema.safeParse(logs[0]);
      if (!zodParseUserOpEventLog.success) {
        console.error(logs[0]);
        console.error(zodParseUserOpEventLog.error.format());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error occured parsing txn Inputs",
          cause: zodParseUserOpEventLog.error,
        });
      }
      const parsedUserOpEventLog = zodParseUserOpEventLog.data;

      if (parsedUserOpEventLog === undefined) {
        console.error("should never reach here");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error has occured.",
          cause: "Log in undefined.",
        });
      }

      const parentHash = parsedUserOpEventLog.transactionHash;

      if (!parentHash) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "parentHash not defined",
          cause: "unknown",
        });
      }

      const txnView = await client.getTransaction({ hash: parentHash });

      const inp = txnView.input;

      const parsedInp: `0x${string}` = `0x${txnView.input.slice(10)}`;

      const parentTxnInput = decodeAbiParameters(
        USER_OPERATION_INPUT,
        parsedInp,
      );

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
        const transport = http(
          `https://mainnet.infura.io/v3/${env.INFURA_KEY}`,
        );
        const client = createPublicClient({
          transport: transport,
        });
        const txn = await client.getTransaction({ hash: txnParse.data });
        console.log("txn", txn);
      }
    }),
});
