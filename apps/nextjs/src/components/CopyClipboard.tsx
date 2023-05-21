import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

import { CopyPopover } from "~/components/CopyIcon";
import { convertToDisplayAddress } from "~/components/convertStrings";

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
          {convertToDisplayAddress(value)}
        </Heading>
      ) : (
        <Text fontSize={size}>{convertToDisplayAddress(value)}</Text>
      )}

      <CopyPopover content={value} size={size} />
    </Flex>
  );
}

export default CopyClipboard;
