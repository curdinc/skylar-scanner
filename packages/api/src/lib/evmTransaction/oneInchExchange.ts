import { TRPCError } from "@trpc/server";
import { isAddressEqual } from "viem";

import { OneInchSwapSchema } from "@skylarScan/schema";
import {
  type EthAddressType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

export async function swapTokens({
  fromAddress,
  toAddress,
  chainId,
  amount,
}: {
  fromAddress: EthAddressType;
  toAddress: EthAddressType;
  chainId: EvmChainIdType;
  amount: bigint;
}) {
  const oneInchUrl = new URL(`https://api.1inch.io/v5.0/${chainId}/quote`);
  oneInchUrl.searchParams.set("fromTokenAddress", fromAddress.toLowerCase());
  oneInchUrl.searchParams.set("toTokenAddress", toAddress.toLowerCase());
  oneInchUrl.searchParams.set("amount", amount.toString());
  const response = await fetch(oneInchUrl.href, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.text();
    console.error("ERROR swapping tokens on one inch: ", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to fetch quote for ${fromAddress} against ${toAddress}`,
      cause: error,
    });
  }
  const swapResult = OneInchSwapSchema.parse(await response.json());
  return swapResult;
}

export async function swapToUsd({
  contractAddress,
  amount,
  chainId,
}: {
  contractAddress: EthAddressType;
  amount: bigint;
  chainId: EvmChainIdType;
}) {
  const usdcContractAddresses = {
    "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "5": "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    "137": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "80001": "0x0fa8781a83e46826621b3bc094ea2a0212e71b23",
  } as const;
  const usdcContractAddress = usdcContractAddresses[chainId];

  // const swapResult = await swapTokens({
  //   fromAddress: isAddressEqual(contractAddress, usdcContractAddress)
  //     ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  //     : contractAddress,
  //   toAddress: usdcContractAddress,
  //   chainId,
  //   amount,
  // });

  const swapResult = {
    fromToken: {
      symbol: "ETH",
      name: "Ether",
      decimals: 18,
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      logoURI:
        "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
    },
    toToken: {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      logoURI:
        "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
    },
    fromTokenAmount: 1000000000000000000n,
    toTokenAmount: 1810000000n,
    estimatedGas: 186779n,
  };

  if (isAddressEqual(contractAddress, usdcContractAddress)) {
    swapResult.fromToken = swapResult.toToken;
    swapResult.fromTokenAmount = amount;
    swapResult.toTokenAmount = amount;
    return swapResult;
  }
  swapResult.toTokenAmount =
    (swapResult.toTokenAmount * amount) / swapResult.fromTokenAmount;
  swapResult.fromTokenAmount = amount;

  return swapResult;
}
