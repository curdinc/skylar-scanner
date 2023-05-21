import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

import { CopyPopover } from "~/components/CopyIcon";
import convertDisplayAddress from "~/components/displayAddress";

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
          {convertDisplayAddress(value)}
        </Heading>
      ) : (
        <Text fontSize={size}>{convertDisplayAddress(value)}</Text>
      )}

      <CopyPopover content={value} size={size} />
    </Flex>
  );
}

export default CopyClipboard;
