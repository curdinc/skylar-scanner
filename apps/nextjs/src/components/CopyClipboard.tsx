import {
  Flex,
  Heading,
  Text,
  useColorModeValue,
  type FlexProps,
} from "@chakra-ui/react";

import { formatEvmAddress } from "~/utils/blockchain";
import { CopyPopover } from "~/components/CopyIcon";

type props = {
  value: string;
  size: string;
  header?: boolean;
} & FlexProps;

function CopyClipboard({ value, size, header, ...props }: props) {
  const color = useColorModeValue("gray.500", "gray.400");
  return (
    <Flex
      alignItems="center"
      gap={`var(--chakra-fontSizes-${size})`}
      {...props}
    >
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
