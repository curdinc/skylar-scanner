import { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { api } from "~/utils/api";
import { CurrentChainIdAtom } from "~/atoms/chain";

export const ParseSearchQueryPage = () => {
  const { mutate: parseSearchQuery } =
    api.evmTransaction.parseSearchQuery.useMutation({
      onSuccess: (data) => {
        // router,replace('')
      },
    });
  const [chainId] = useAtom(CurrentChainIdAtom);
  const router = useRouter();
  const {
    query: { searchQuery },
  } = router;
  console.log("searchQuery", searchQuery);

  useEffect(() => {
    if (searchQuery && typeof searchQuery === "string") {
      parseSearchQuery({
        query: searchQuery,
        chainId,
      });
    }
  }, [chainId, parseSearchQuery, searchQuery]);

  if (!searchQuery) {
    return (
      <Center flexGrow={1}>
        <Text>Invalid Address or transaction</Text>
      </Center>
    );
  }
  return (
    <Center flexGrow={1}>
      <Spinner />
    </Center>
  );
};
