import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

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
      if (searchQuery.length === 1 && typeof searchQuery[0] === "string") {
        parseSearchQuery({
          query: searchQuery[0],
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
