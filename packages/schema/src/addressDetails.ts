import { z } from "zod";

import {
  EthAddressSchema,
  EthHashSchema,
  EvmChainIdSchema,
} from "./evmTransaction";

export const parseQuerySchema = z.union([
  EthHashSchema,
  EthAddressSchema,
  z.string().endsWith(".eth"),
]);

export const EvmParseQuerySchema = z.object({
  query: parseQuerySchema,
  chainId: EvmChainIdSchema,
});

export const EvmAddressTokensAndNftsQuerySchema = z.object({
  address: EthAddressSchema,
  chainId: EvmChainIdSchema,
});
export type EvmAddressTokensAndNftsQueryType = z.infer<
  typeof EvmAddressTokensAndNftsQuerySchema
>;

export const NftDetailsSchema = z.object({
  balance: z.number(),
  contract: z.object({
    address: EthAddressSchema,
    tokenType: z.string(),
    openSea: z
      .object({
        floorPrice: z.number().optional(),
        collectionName: z.string().optional(),
      })
      .optional(),
  }),
  title: z.string(),
  media: z
    .object({
      gateway: z.string().url(),
      thumbnail: z.string().url().optional(),
    })
    .array(),
});

export const TransactionsDetailsSchema = z.object({
  userOp: EthHashSchema,
  bundleHash: EthAddressSchema,
  time: z.date(),
  gasUsdcPricePaid: z.string(),
});

export type TransactionsDetailsType = z.infer<typeof TransactionsDetailsSchema>;
