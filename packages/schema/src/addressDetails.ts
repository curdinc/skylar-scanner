import { z } from "zod";

import { EthHashSchema, EvmChainIdSchema } from "./evmTransaction";

export const EvmAddressTokensAndNftsQuerySchema = z.object({
  address: EthHashSchema,
  chainId: EvmChainIdSchema,
});
export type EvmAddressTokensAndNftsQueryType = z.infer<
  typeof EvmAddressTokensAndNftsQuerySchema
>;
