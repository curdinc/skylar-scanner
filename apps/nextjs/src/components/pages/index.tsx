import Head from "next/head";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { BrandIcon } from "../BrandIcon";
import { SearchBar } from "../SearchBar";

export const HomePage = () => {
  return (
    <>
      <Head>
        <title>Skylar Scanner - Evm 4337 Explorer</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
