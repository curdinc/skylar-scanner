import { z } from "zod";

export const EthAddressSchema = z.string().regex(/^0x[0-9,a-f,A-F]{40}$/);
export const EthHashSchema = z.custom<`0x{string}`>((val) => {
  return _EthHashSchema.safeParse(val).success;
});
export const _EthHashSchema = z.string().regex(/^0x[0-9a-f]{64}$/);
export const BytesSchema = z.string().regex(/^0x[0-9a-f]*$/);
export const BloomFilterSchema = z.string().regex(/^0x[0-9a-f]{512}$/);
export const HexNumberSchema = z.string().regex(/^0x([1-9a-f]+[0-9a-f]*|0)$/);

export const BlockNonceSchema = z.string().regex(/^0x[0-9a-f]{16}$/);
export const BlockTagSchema = z.enum([
  "earliest",
  "finalized",
  "safe",
  "latest",
  "pending",
]);
export const BlockNumberSchema = z.union([HexNumberSchema, BlockTagSchema]);

export const EvmChainIdSchema = z.union([
  z.literal("0x1"),
  z.literal("0x5"),
  z.literal("0x89"),
]);
