import { goerli, mainnet, polygon, polygonMumbai } from "viem/chains";
import { z } from "zod";

export const EthAddressSchema = z.custom<`0x{string}`>((val) => {
  return _EthAddressSchema.safeParse(val).success;
});
export const _EthAddressSchema = z.string().regex(/^0x[0-9,a-f,A-F]{40}$/);
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
  z.literal(mainnet.id),
  z.literal(goerli.id),
  z.literal(polygon.id),
  z.literal(polygonMumbai.id),
]);
export type EvmChainIdType = z.infer<typeof EvmChainIdSchema>;
export const userOpSchema = z.object({
  sender: EthAddressSchema,
  nonce: z.bigint(),
  initCode: BytesSchema,
  callData: BytesSchema,
  callGasLimit: z.bigint(),
  verificationGasLimit: z.bigint(),
  preVerificationGas: z.bigint(),
  maxFeePerGas: z.bigint(),
  maxPriorityFeePerGas: z.bigint(),
  paymasterAndData: BytesSchema,
  signature: BytesSchema,
  beneficiary: EthAddressSchema,
});

export const userOpLogSchema = z.object({
  address: EthAddressSchema,
  blockHash: EthHashSchema,
  blockNumber: z.bigint(),
  data: BytesSchema,
  logIndex: z.bigint(),
  removed: z.boolean(),
  //topics: HexNumberSchema.array().length(4),
  transactionHash: EthHashSchema,
  transactionIndex: z.bigint(),
  args: z.object({
    userOpHash: EthHashSchema,
    sender: EthAddressSchema,
    paymaster: EthAddressSchema,
    nonce: z.bigint(),
    success: z.boolean(),
    actualGasCost: z.bigint(),
    actualGasUsed: z.bigint(),
  }),
  eventName: z.string(),
});
