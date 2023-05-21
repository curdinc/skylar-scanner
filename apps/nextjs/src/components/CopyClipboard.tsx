import { Flex, Heading, Text } from "@chakra-ui/react";

import { formatEvmAddress } from "~/utils/blockchain";
import { CopyPopover } from "~/components/CopyIcon";

interface props {
  value: string;
  size: string;
  header?: boolean;
}

function CopyClipboard({ value, size, header }: props) {
  return (
    <Flex alignItems="center" gap={`var(--chakra-fontSizes-${size})`}>
      {header ? (
        <Heading size={size} as={"h2"}>
          {formatEvmAddress(value)}
        </Heading>
      ) : (
        <Text fontSize={size}>{formatEvmAddress(value)}</Text>
      )}

      <CopyPopover content={value} size={size} />
    </Flex>
  );
}

export default CopyClipboard;
