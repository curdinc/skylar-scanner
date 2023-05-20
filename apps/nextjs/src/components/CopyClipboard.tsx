import React from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { Check, Copy } from "lucide-react";

interface props {
  value: string;
  size: string;
}

function CopyClipboard({ value, size }: props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const valueSimplified =
    value.substring(0, 5) + "..." + value.substring(value.length - 4);

  return (
    <Flex alignItems="center" gap={`var(--chakra-fontSizes-${size})`}>
      <Heading as="p" fontSize={size}>
        {valueSimplified}
      </Heading>

      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <IconButton
            aria-label="copy"
            variant="ghost"
            _hover={{ backgroundColor: "transparent" }}
            isDisabled={isOpen}
            size={size}
            onClick={() => {
              onOpen();
              navigator.clipboard.writeText(value);
              setTimeout(() => {
                onClose();
              }, 1500);
            }}
            icon={
              isOpen ? (
                <Box
                  as={Check}
                  sx={{ width: `var(--chakra-fontSizes-${size})` }}
                />
              ) : (
                <Box
                  as={Copy}
                  sx={{ width: `var(--chakra-fontSizes-${size})` }}
                />
              )
            }
          />
        </PopoverTrigger>

        <Box
          as={PopoverContent}
          width={"fit-content"}
          _focusVisible={{
            boxShadow: "none",
          }}
        >
          <PopoverArrow />
          <PopoverBody>Copied to clipboard!</PopoverBody>
        </Box>
      </Popover>
    </Flex>
  );
}

export default CopyClipboard;
