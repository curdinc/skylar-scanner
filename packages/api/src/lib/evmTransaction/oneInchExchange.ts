import { OneInchSwapSchema } from "@skylarScan/schema";
import {
  type EthAddressType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

export async function swapTokens(
  fromAddress: EthAddressType,
  toAddress: EthAddressType,
  chainId: EvmChainIdType,
  amount: bigint,
) {
  const oneInchUrl = new URL(`https://api.1inch.io/v5.0/${chainId}/quote`);
  oneInchUrl.searchParams.set("fromTokenAddress", fromAddress);
  oneInchUrl.searchParams.set("toTokenAddress", toAddress);
  oneInchUrl.searchParams.set("amount", amount.toString());
  const response = await fetch(oneInchUrl.href);
  if (!response.ok) {
    throw new Error("Failed to fetch 1inch quote");
  }
  const swapResult = OneInchSwapSchema.parse(await response.json());
  return swapResult;
}
