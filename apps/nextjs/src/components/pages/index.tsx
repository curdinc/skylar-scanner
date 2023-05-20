import { Flex, Heading, Stack } from "@chakra-ui/react";

import Navbar from "~/components/NavBar";
import { SearchBar } from "../SearchBar";

export const HomePage = () => {
  return (
    <Flex
      direction="column"
      alignItems={"center"}
      w="full"
      h="full"
      minH={"100vh"}
    >
      <Navbar showSearchBar={false} />
      <Stack
        flex={1}
        w="full"
        maxW="2xl"
        alignItems="center"
        justifyContent={"center"}
        spacing={5}
      >
        <Heading>Skylar Transaction Explorer</Heading>
        <SearchBar />
      </Stack>
    </Flex>
  );
};
