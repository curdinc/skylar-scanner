import { Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

import { formatEvmAddress } from "~/utils/blockchain";
import { CopyPopover } from "~/components/CopyIcon";

interface props {
  value: string;
  size: string;
  header?: boolean;
}

function CopyClipboard({ value, size, header }: props) {
  const color = useColorModeValue("gray.500", "gray.400");
  return (
    <Flex alignItems="center" gap={`var(--chakra-fontSizes-${size})`}>
      {header ? (
        <Heading size={size} as={"h2"}>
          {formatEvmAddress(value)}
        </Heading>
      ) : (
        <Text fontSize={size} color={color}>
          {formatEvmAddress(value)}
        </Text>
      )}

      <CopyPopover content={value} size={size} />
    </Flex>
  );
}

export default CopyClipboard;
