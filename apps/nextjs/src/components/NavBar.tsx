import {
  Box,
  Button,
  Flex,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Moon, SunMedium as Sun } from "lucide-react";

import SearchBar from "~/components/SearchBar";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px="4">
      <Flex h={16} alignItems="center" justifyContent="space-between" gap="4">
        <Box>Logo</Box>
        <Flex
          className="max-w-2xl rounded	shadow-md"
          sx={{
            flexGrow: "1",
            height: "70%",
          }}
        >
          <SearchBar />
        </Flex>
        <Button onClick={toggleColorMode} padding="2">
          {colorMode === "light" ? (
            <Moon size="1.3rem" />
          ) : (
            <Sun size="1.3rem" />
          )}
        </Button>
      </Flex>
    </Box>
  );
}
