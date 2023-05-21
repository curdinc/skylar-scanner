import { z } from "zod";

import { EthAddressSchema } from "./evmTransaction";

export const oneInchTokenSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  address: EthAddressSchema,
  logoURI: z.string().url(),
});
export type OneInchTokenType = z.infer<typeof oneInchTokenSchema>;

export const OneInchSwapSchema = z.object({
  fromToken: oneInchTokenSchema,
  toToken: oneInchTokenSchema,
  toTokenAmount: z.coerce.bigint(),
  fromTokenAmount: z.coerce.bigint(),
  estimatedGas: z.coerce.bigint(),
});
export type OneInchSwapType = z.infer<typeof OneInchSwapSchema>;
