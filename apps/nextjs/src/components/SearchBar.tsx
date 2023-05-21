import React from "react";
import router from "next/router";
import {
  Box,
  Flex,
  Icon,
  Kbd,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  type Action,
} from "kbar";
import { Moon, Search, SunMedium as Sun } from "lucide-react";

import { parseQuerySchema } from "@skylarScan/schema/src/addressDetails";

import { Ethereum, Polygon } from "~/assets/chainIcons";
import { CurrentChainIdAtom } from "~/atoms/chain";

export function SearchBar() {
  const bgcolor = useColorModeValue("gray.200", "gray.700");
  const { search, query, visualState } = useKBar((state) => ({
    search: state.searchQuery,
    visualState: state.visualState,
  }));

  const onSubmit = () => {
    if (parseQuerySchema.safeParse(search).success) {
      if (visualState === "showing") {
        query.toggle();
      }
      router.push(`/parse/${search}`).catch((e) => {
        console.log(`Error routing to parse/${search}: `, e);
      });
    }
  };

  return (
    <Flex
      px={5}
      alignItems="center"
      bg={bgcolor}
      w="full"
      shadow={"md"}
      rounded="lg"
      h="12"
    >
      <Search size="20" />
      {/* Search input */}
      <Flex w="full" flexGrow={1}>
        <KBarSearch
          id="search"
          className="w-full bg-transparent px-4	outline-none"
          defaultPlaceholder="0xdeadbeefcafe..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
            if (e.key === "Escape") {
              document.getElementById("search")?.blur();
            }
          }}
        />
      </Flex>
      <Flex alignItems="center">⌘K</Flex>
    </Flex>
  );
}

export function RenderResults() {
  const { results } = useMatches();
  const bgcolor = useColorModeValue("gray.200", "gray.700");

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        return typeof item === "string" ? (
          <Flex px={4} py={2} w="full" fontSize={"sm"} opacity={0.6}>
            {item}
          </Flex>
        ) : (
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            width="full"
            px={8}
            py={4}
            bg={active ? bgcolor : "transparent"}
          >
            <Flex alignItems={"center"}>
              {item.icon}
              <Text>{item.name}</Text>
            </Flex>
            {item.shortcut && <Kbd> {item.shortcut.join(" + ")}</Kbd>}
          </Flex>
        );
      }}
    />
  );
}

export function KBarSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setColorMode } = useColorMode();
  const [, setChainId] = useAtom(CurrentChainIdAtom);

  const actions: Action[] = [
    {
      id: "ethereum",
      name: "Ethereum",
      shortcut: ["n", "e"],
      keywords: "mainnet homestead 1 0x1",
      section: "Network",
      icon: <Icon as={Ethereum} rounded="full" mr={2} />,
      perform: () => setChainId("1"),
    },
    {
      id: "polygon",
      name: "Polygon",
      shortcut: ["n", "p"],
      keywords: "Mumbai Maticum mainnet 0x89 137",
      section: "Network",
      icon: <Icon as={Polygon} rounded="full" mr={2} />,
      perform: () => setChainId("137"),
    },
    {
      id: "goerli",
      name: "Goerli",
      shortcut: ["n", "g"],
      keywords: "testnet 5 0x5",
      section: "Network",
      icon: <Icon as={Ethereum} testnet rounded="full" mr={2} />,
      perform: () => setChainId("5"),
    },
    {
      id: "mumbai",
      name: "Mumbai",
      shortcut: ["n", "m"],
      keywords: "Mumbai Polygon testnet 80001",
      section: "Network",
      icon: <Icon as={Polygon} testnet rounded="full" mr={2} />,

      perform: () => setChainId("80001"),
    },
    {
      id: "dark",
      name: "Dark Mode",
      shortcut: ["d"],
      keywords: "dark",
      section: "Theme",
      icon: <Icon as={Moon} size="20" mr={2} />,
      perform: () => setColorMode("dark"),
    },
    {
      id: "light",
      name: "Light Mode",
      shortcut: ["l"],
      keywords: "light blind",
      section: "Theme",
      icon: <Icon as={Sun} size="20" mr={2} />,
      perform: () => setColorMode("light"),
    },
  ];

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
      actions={actions}
    >
      {children}
    </KBarProvider>
  );
}

export function KBarSearchPopUp() {
  return (
    // Renders the content outside the root node
    <KBarPortal>
      {/* Centers the content + create dark background */}
      <KBarPositioner className="flex items-center bg-gray-900/80 p-2">
        {/* show/hide and height animations */}
        <Box
          as={KBarAnimator}
          bg={useColorModeValue("gray.100", "gray.800")}
          rounded="lg"
          width="100%"
          maxWidth="2xl"
          overflow="hidden"
        >
          <Flex height="16" alignContent="center">
            <SearchBar />
          </Flex>
          <RenderResults />
        </Box>
      </KBarPositioner>
    </KBarPortal>
  );
}
