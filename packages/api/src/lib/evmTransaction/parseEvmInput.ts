import { TRPCError } from "@trpc/server";

import {
  EthAddressSchema,
  EthHashSchema,
  type EvmChainIdType,
} from "@skylarScan/schema";

import { getViemClient } from "./client";
import { ENTRY_POINT_CONTRACT_ADDRESSES } from "./constants";
import { getUserOp } from "./getUserOp";

export async function parseEvmInput(query: string, chainId: EvmChainIdType) {
  const addressParse = EthAddressSchema.safeParse(query);
  const txnParse = EthHashSchema.safeParse(query);
  if (addressParse.success) {
    // TODO
  }
  if (txnParse.success) {
    const client = getViemClient(chainId);
    try {
      const txn = await client.getTransaction({ hash: txnParse.data });
      console.log("txn", txn);
      if (txn.to && ENTRY_POINT_CONTRACT_ADDRESSES[chainId].includes(txn.to)) {
        return `/bundle/${chainId}/${txn.hash}`;
      }
      return `/tx/${chainId}/${txn.hash}`;
    } catch (e) {
      console.error("Error getting transaction", e);
      try {
        const userOp = await getUserOp(chainId, txnParse.data);
        console.log("userOp", userOp);
        if (userOp) {
          return `/user-operation/${chainId}/${txnParse.data}`;
        }
      } catch (e) {
        console.error("Error getting user operation", e);
      }
    }
  }
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "Invalid address or transaction given",
  });
}
