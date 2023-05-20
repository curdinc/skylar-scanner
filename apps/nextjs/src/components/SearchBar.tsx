import React from "react";
import { useRouter } from "next/router";
import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
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
import { Search } from "lucide-react";

export function SearchBar() {
  const bgcolor = useColorModeValue("gray.200", "gray.700");
  const { search, query } = useKBar((state) => ({
    search: state.searchQuery,
    activeIndex: state.activeIndex,
  }));

  const router = useRouter();

  const onSubmit = () => {
    if (search.startsWith("0x")) {
      query.toggle();
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
      <Search size="1.3rem" />
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
          <div>{item}</div>
        ) : (
          <Flex
            width="100%"
            paddingX={4}
            paddingY={4}
            bg={active ? bgcolor : "transparent"}
          >
            {item.name}
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

  const actions: Action[] = [
    {
      id: "dark",
      name: "Dark Mode",
      shortcut: ["d"],
      keywords: "dark",
      perform: () => setColorMode("dark"),
    },
    {
      id: "light",
      name: "Light Mode",
      shortcut: ["l"],
      keywords: "light blind",
      perform: () => setColorMode("light"),
    },
  ];

  return <KBarProvider actions={actions}>{children}</KBarProvider>;
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
