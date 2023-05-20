import React from "react";
import { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";

import Navbar from "./NavBar";

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Flex
      direction="column"
      alignItems={"center"}
      w="full"
      h="full"
      minH={"100vh"}
    >
      <Navbar showSearchBar={router.pathname !== "/"} />
      {children}
    </Flex>
  );
}
