import React from "react";
import { Box } from "@chakra-ui/react";
import { KBarSearch } from "kbar";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <Box
      sx={{
        padding: "0 1rem",
        display: "flex",
        alignItems: "center",
        flexGrow: "1",
      }}
    >
      <Search size="1.3rem" />
      {/* Search input */}
      <KBarSearch
        className="flex w-full w-full grow rounded-xl bg-transparent px-4	outline-none"
        defaultPlaceholder="Something lol"
      />
      <Box display="flex" alignItems="center">
        ⌘K
      </Box>
    </Box>
  );
}

export default SearchBar;
