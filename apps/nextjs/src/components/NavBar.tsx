import Image from "next/image";
import { useRouter } from "next/router";
import {
  Button,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Moon, SunMedium as Sun } from "lucide-react";

import cat2 from "../../public/cat2.svg";
import { ChainSelector } from "./ChainSelector";
import { SearchBar } from "./SearchBar";

export default function Navbar({
  showSearchBar = true,
}: {
  showSearchBar?: boolean;
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const imgFilter = useColorModeValue("invert(20%)", "invert(85%)");
  return (
    <Flex
      bg={useColorModeValue("gray.100", "dark.600")}
      px="4"
      w="full"
      h={20}
      alignItems="center"
      justifyContent="space-between"
      gap="4"
    >
      <Button
        onClick={() => {
          router.push("/").catch((e) => {
            console.log(`Error routing to /: `, e);
          });
        }}
        variant={"ghost"}
      >
        <Image
          src={cat2}
          alt="cute cat logo"
          width={42}
          style={{ filter: imgFilter }}
        />
      </Button>

      {showSearchBar && (
        <Flex maxW={"2xl"} justifyContent={"center"} flexGrow={1}>
          <SearchBar />
        </Flex>
      )}
      <Flex alignItems={"center"} gap={2}>
        <ChainSelector />
        <Button onClick={toggleColorMode} padding="2">
          {colorMode === "light" ? (
            <Moon size="1.3rem" />
          ) : (
            <Sun size="1.3rem" />
          )}
        </Button>
      </Flex>
    </Flex>
  );
}
