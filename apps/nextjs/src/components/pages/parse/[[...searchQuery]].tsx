import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { EvmTransactionClientQuerySchema } from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { CurrentChainIdAtom } from "~/atoms/chain";

export const ParseSearchQueryPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { mutate: parseSearchQuery } =
    api.evmTransaction.parseSearchQuery.useMutation({
      onSuccess: (data) => {
        router.replace(data).catch((e) => {
          console.log(`Error routing to ${data}: `, e);
        });
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const [chainId] = useAtom(CurrentChainIdAtom);
  const {
    query: { searchQuery },
  } = router;

  useEffect(() => {
    if (searchQuery && searchQuery instanceof Array) {
      const result = EvmTransactionClientQuerySchema.safeParse({
        chainId,
        txnHash: searchQuery,
      });
      if (result.success) {
        parseSearchQuery({
          txnHash: result.data.txnHash[0] ?? "0x",
          chainId,
        });
      } else {
        setError("Invalid Address or transaction");
      }
    }
  }, [chainId, parseSearchQuery, searchQuery]);

  if (error) {
    return (
      <Center flexGrow={1}>
        <Text>{error}</Text>
      </Center>
    );
  }
  return (
    <Center flexGrow={1}>
      <Spinner />
    </Center>
  );
};
