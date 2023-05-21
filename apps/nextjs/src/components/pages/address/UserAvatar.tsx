import { Avatar, Flex, Heading, Skeleton } from "@chakra-ui/react";

import { type EthAddressType } from "@skylarScan/schema/src/evmTransaction";

import { formatEvmAddress } from "~/utils/blockchain";

export const UserAvatar = ({
  address,
  isLoading,
  ensName,
  ensAvatar,
}: {
  ensName?: string;
  ensAvatar?: string;
  address: EthAddressType;
  isLoading: boolean;
}) => {
  return (
    <Flex align="center" mb={6}>
      <Skeleton isLoaded={!isLoading} rounded="full">
        <Avatar
          name={ensName || address.slice(2)}
          src={ensAvatar ?? undefined}
        />
      </Skeleton>
      <Skeleton isLoaded={!isLoading} ml={4}>
        <Heading fontSize="2xl">{ensName || formatEvmAddress(address)}</Heading>
      </Skeleton>
    </Flex>
  );
};
