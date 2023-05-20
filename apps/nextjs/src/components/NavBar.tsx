import {
  Box,
  Button,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Moon, SunMedium as Sun } from "lucide-react";

import { SearchBar } from "./SearchBar";

export default function Navbar({
  showSearchBar = true,
}: {
  showSearchBar?: boolean;
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      bg={useColorModeValue("gray.100", "gray.900")}
      px="4"
      w="full"
      h={20}
      alignItems="center"
      justifyContent="space-between"
      gap="4"
    >
      <Box>Logo</Box>
      {showSearchBar && (
        <Flex maxW={"2xl"} justifyContent={"center"} flexGrow={1}>
          <SearchBar />
        </Flex>
      )}
      <Button onClick={toggleColorMode} padding="2">
        {colorMode === "light" ? <Moon size="1.3rem" /> : <Sun size="1.3rem" />}
      </Button>
    </Flex>
  );
}
