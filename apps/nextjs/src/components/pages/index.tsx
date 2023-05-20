import { Heading, Stack } from "@chakra-ui/react";

import { SearchBar } from "../SearchBar";

export const HomePage = () => {
  return (
    <Stack
      flex={1}
      w="full"
      maxW="2xl"
      alignItems="center"
      justifyContent={"center"}
      spacing={8}
    >
      <Heading fontSize={"5xl"}>Skylar Scanner</Heading>
      <SearchBar />
    </Stack>
  );
};
