import { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Spinner } from "@chakra-ui/react";
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

  useEffect(() => {
    if (searchQuery && typeof searchQuery === "string") {
      parseSearchQuery({
        query: searchQuery,
        chainId,
      });
    }
  }, [chainId, parseSearchQuery, searchQuery]);

  return (
    <Center flexGrow={1}>
      <Spinner />
    </Center>
  );
};
