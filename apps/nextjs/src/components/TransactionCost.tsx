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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AlertCircle, Copy } from "lucide-react";

import { type userOpType } from "@skylarScan/schema/src/evmTransaction";

import { CopyPopover, IconDefault } from "~/components/CopyIcon";
import convertDisplayAddress from "~/components/displayAddress";

interface props {
  data: userOpType;
  size: string;
}

function TransactionCost({ data, size }: props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO update this from data [not included yet]
  const boughtUnits = 1234;
  const totalUnits = 1232;
  const cost = 17;
  const paymaster = "0xawdaw12312312";
  const value = 0.002;

  console.log(convertDisplayAddress);

  return (
    <Flex
      alignItems="center"
      gap={`var(--chakra-fontSizes-${size})`}
      marginTop="0"
    >
      <Text fontSize={size}>${value}USD</Text>

      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="copy"
            size={"1"}
            variant="ghost"
            _hover={{ backgroundColor: "transparent" }}
            isDisabled={isOpen}
            icon={<IconDefault icon={AlertCircle} size={size} />}
          />
        </PopoverTrigger>

        <Box
          as={PopoverContent}
          _focusVisible={{
            boxShadow: "none",
          }}
        >
          <PopoverArrow />
          <PopoverBody>
            <Flex alignItems={"center"}>
              <Text
                size="xs"
                noOfLines={3}
                textAlign="center"
                width={"fit-content"}
              >
                {`${boughtUnits} out of ${totalUnits} @ ${cost} gwei / gas. Sponsored by ${convertDisplayAddress(
                  paymaster,
                )}`}
              </Text>
              <CopyPopover content={paymaster} size={size} />
            </Flex>
          </PopoverBody>
        </Box>
      </Popover>
    </Flex>
  );
}

export default TransactionCost;
