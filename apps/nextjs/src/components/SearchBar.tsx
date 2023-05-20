import React from "react";
import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from "kbar";
import { Search } from "lucide-react";

export function SearchBar() {
  const bgcolor = useColorModeValue("gray.200", "gray.700");
  const [search, setSearch] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    // TODO: Figure out where to route
    console.log("search", search);
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
      <Flex as={"form"} w="full" flexGrow={1} onSubmit={onSubmit}>
        <KBarSearch
          className="w-full bg-transparent px-4	outline-none"
          defaultPlaceholder="0xdeadbeefcafe..."
          value={search}
          onChange={(value) => {
            setSearch(value.target.value);
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
      onRender={({ item, active }) =>
        typeof item === "string" ? (
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
        )
      }
    />
  );
}

export function KBarSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setColorMode } = useColorMode();

  const actions = [
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
        {/* <KBarAnimator 
        </KBarAnimator> */}
      </KBarPositioner>
    </KBarPortal>
  );
}
