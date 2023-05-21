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
  address: EthHashSchema,
  chainId: EvmChainIdSchema,
});
export type EvmAddressTokensAndNftsQueryType = z.infer<
  typeof EvmAddressTokensAndNftsQuerySchema
>;
