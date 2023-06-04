import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { EvmParseQuerySchema } from "@skylar-scanner/schema/src/addressDetails";

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
    setError("");
    if (searchQuery && typeof searchQuery === "string") {
      const result = EvmParseQuerySchema.safeParse({
        chainId,
        query: searchQuery,
      });
      if (result.success) {
        parseSearchQuery({
          query: result.data.query,
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
