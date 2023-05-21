import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

import { CopyPopover, IconDefault } from "~/components/CopyIcon";

interface props {
  popoverDetails: string;
  copy: string;
  size: string;
  cost: string;
}

function TransactionCost({ popoverDetails, copy, size, cost }: props) {
  const { isOpen } = useDisclosure();

  const color = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      alignItems="center"
      gap={`var(--chakra-fontSizes-${size})`}
      marginTop="0"
    >
      <Text fontSize={size} color={color}>
        {cost}
      </Text>

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
                fontSize="xxs"
                noOfLines={3}
                textAlign="center"
                width={"fit-content"}
              >
                {popoverDetails}
              </Text>
              {copy && copy.length > 0 && (
                <CopyPopover content={copy} size={size} />
              )}
            </Flex>
          </PopoverBody>
        </Box>
      </Popover>
    </Flex>
  );
}

export default TransactionCost;
