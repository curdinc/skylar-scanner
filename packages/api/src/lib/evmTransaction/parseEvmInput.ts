import { TRPCError } from "@trpc/server";
import { normalize } from "viem/ens";

import {
  EthAddressSchema,
  EthHashSchema,
  type EvmChainIdType,
} from "@skylarScan/schema";

import { getViemClient } from "./client";
import { ENTRY_POINT_CONTRACT_ADDRESSES } from "./constants";
import { getUserOp } from "./getUserOp";
import { isEoaAddressEqual } from "./utils";

export const getEnsAddress = async (query: string) => {
  const provider = getViemClient("1");
  try {
    const address = await provider.getEnsAddress({
      name: normalize(query),
    });
    return address ?? undefined;
  } catch (e) {
    console.error("ERROR: resolving address from ENS: ", e);
    return undefined;
  }
};

export async function parseEvmInput(query: string, chainId: EvmChainIdType) {
  console.log("parseInput");

  const txnParse = EthHashSchema.safeParse(query);
  if (txnParse.success) {
    const client = getViemClient(chainId);
    try {
      const txn = await client.getTransaction({ hash: txnParse.data });
      console.log("txn", txn);
      const to = txn.to;
      if (
        to &&
        ENTRY_POINT_CONTRACT_ADDRESSES[chainId].filter((epca) => {
          return isEoaAddressEqual(epca, to);
        }).length === 1
      ) {
        return `/bundle/${chainId}/${txn.hash}`;
      }
      return `/tx/${chainId}/${txn.hash}`;
    } catch (e) {
      console.error("Error getting transaction", e);
      try {
        console.log("getUop");

        const userOp = await getUserOp(chainId, txnParse.data, false);
        console.log("userOp", userOp);
        if (userOp) {
          return `/user-operation/${chainId}/${txnParse.data}`;
        }
      } catch (e) {
        console.error("Error getting user operation", e);
      }
    }
  }

  const maybeAddress = await getEnsAddress(query);
  const addressParse = EthAddressSchema.safeParse(maybeAddress ?? query);
  if (addressParse.success) {
    return `/address/${addressParse.data}`;
  }
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "Invalid address or transaction given",
  });
}
