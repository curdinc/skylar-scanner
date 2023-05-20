import { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Spinner } from "@chakra-ui/react";

import { api } from "~/utils/api";

export const ParseSearchQueryPage = () => {
  const { mutate: parseSearchQuery } =
    api.evmTransaction.parseSearchQuery.useMutation({
      onSuccess: (data) => {
        // router,replace('')
      },
    });
  const router = useRouter();
  const {
    query: { searchQuery },
  } = router;

  useEffect(() => {
    if (searchQuery && typeof searchQuery === "string") {
      parseSearchQuery({
        query: searchQuery,
      });
    }
  }, [parseSearchQuery, searchQuery]);

  return (
    <Center flexGrow={1}>
      <Spinner />
    </Center>
  );
};
