import { formatGwei, formatUnits, isAddressEqual } from "viem";

import { EvmParseQuerySchema } from "@skylarScan/schema/src/addressDetails";
import {
  EthHashSchema,
  EvmTransactionQuerySchema,
  userOpDetailsSchema,
  userOpInfoPayloadSchema,
  type transactionType,
} from "@skylarScan/schema/src/evmTransaction";

import { getViemClient } from "../lib/evmTransaction/client";
import { ENTRY_POINT_CONTRACT_ADDRESSES } from "../lib/evmTransaction/constants";
import { getUserOp } from "../lib/evmTransaction/getUserOp";
import { swapToUsd } from "../lib/evmTransaction/oneInchExchange";
import { parseEvmInput } from "../lib/evmTransaction/parseEvmInput";
import {
  getTokenAndNFTDataFromBundleHash,
  parseBundleInput,
} from "../lib/evmTransaction/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const evmTransactionRouter = createTRPCRouter({
  // returns userOpDetailsSchema
  userOpInfo: publicProcedure
    .input(EvmTransactionQuerySchema)
    .query(async ({ input }) => {
      const { chainId, txnHash: searchQuery } = input;
      const res = await getUserOp(chainId, searchQuery, true);
      console.log("res", res);
      const zodParsed = userOpDetailsSchema.safeParse(res);
      if (!zodParsed.success) {
        console.error(JSON.stringify(zodParsed.error.format(), null, 2));
      }

      return res;
    }),

  // testing
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
      const txnReceipt = await client.getTransactionReceipt({
        hash: EthHashSchema.parse(txnHash),
      });
      const block = await client.getBlock({
        blockNumber: txnReceipt.blockNumber,
      });
      const tokenAndNFTData = await getTokenAndNFTDataFromBundleHash(
        txnHash,
        chainId,
      );
      console.log("tokenAndNFTData", tokenAndNFTData);
      const transactionCostSwapDetails = await swapToUsd({
        chainId,
        amount: txnReceipt.effectiveGasPrice * txnReceipt.gasUsed,
        contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      });
      const transactionCost = formatUnits(
        transactionCostSwapDetails.toTokenAmount,
        transactionCostSwapDetails.toToken.decimals,
      );
      const transactionObject: transactionType = {
        to: txnReceipt.to ?? undefined,
        from: txn.from,
        blockNumber: txn.blockNumber ?? 0n,
        gasData: {
          baseFeePerGas: formatGwei(txn.gasPrice ?? 0n),
          gasPrice: formatGwei(txnReceipt.effectiveGasPrice),
          gasUsed: txnReceipt.gasUsed.toString(),
          gasLimit: txn.gas.toString(),
          maxFeePerGas: formatGwei(txn.maxFeePerGas ?? 0n),
          tipFeePerGas: formatGwei(txn.maxPriorityFeePerGas ?? 0n),
          usdcPricePaid: transactionCost.toString(),
        },
        nonce: txn.nonce,
        rawInput: txn.input,
        timestamp: new Date(Number(block.timestamp * 1000n)),
        txnHash: txnHash,
        tokens: [],
        nfts: [],
        coins: [],
      };

      const to = txn.to;
      if (
        to &&
        ENTRY_POINT_CONTRACT_ADDRESSES[chainId].filter((epca) => {
          return isAddressEqual(epca, to);
        }).length === 1
      ) {
        transactionObject.parsedInput = parseBundleInput(txn.input);
        tokenAndNFTData.forEach((data) => {
          transactionObject.nfts.push(...data.nfts);
          transactionObject.tokens.push(...data.tokens);
        });
      } else {
        transactionObject.nfts = tokenAndNFTData[0]?.nfts ?? [];
        transactionObject.tokens = tokenAndNFTData[0]?.tokens ?? [];
      }

      return transactionObject;
    }),

  parseSearchQuery: publicProcedure
    .input(EvmParseQuerySchema)
    .mutation(async ({ input }) => {
      const { query, chainId } = input;
      return parseEvmInput(query, chainId);
    }),
});
