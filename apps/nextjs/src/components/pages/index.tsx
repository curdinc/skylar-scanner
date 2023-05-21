import Head from "next/head";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { BrandIcon } from "../BrandIcon";
import { SearchBar } from "../SearchBar";

export const HomePage = () => {
  return (
    <>
      <Head>
        <title>Skylar Scanner - Evm 4337 Explorer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Skylar Scanner - Evm 4337 Explorer"
          key="title"
        />
      </Head>
      <Stack
        flex={1}
        w="full"
        maxW="2xl"
        marginTop={-20}
        alignItems="center"
        justifyContent={"center"}
        spacing={8}
      >
        <Stack alignItems={"center"}>
          <Flex>
            <BrandIcon size="lg" />
            <Heading ml={2} fontSize={"5xl"}>
              Skylar Scanner
            </Heading>
          </Flex>
          <Text opacity={0.7}>Evm 4337 Explorer</Text>
        </Stack>
        <SearchBar />
      </Stack>
    </>
  );
};
