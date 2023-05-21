import Image from "next/image";
import {
  Center,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatUnits } from "viem";

import { type EvmChainIdType } from "@skylarScan/schema";
import { type EthAddressType } from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";

export const TokenDisplay = ({
  address,
  chainId,
}: {
  address: EthAddressType;
  chainId: EvmChainIdType;
}) => {
  const {
    data: tokenData,
    isLoading,
    error,
  } = api.evmAddress.tokens.useQuery(
    {
      address,
      chainId,
    },
    {
      enabled: address !== "0x",
      refetchOnWindowFocus: false,
    },
  );

  if (error) {
    return <Center flexGrow={1}>{error.message}</Center>;
  }
  let TableBody = (
    <>
      {tokenData?.map((token) => {
        return (
          <Tr key={token.fromToken.name}>
            <Td>
              <Flex alignItems="center">
                <Image
                  width={30}
                  height={30}
                  alt={token.fromToken.name}
                  src={token.fromToken.logoURI}
                />
                <Heading fontWeight={"semibold"} fontSize="xl" ml={2}>
                  {token.fromToken.name}
                </Heading>
              </Flex>
            </Td>
            <Td>
              <Stack w="full" alignItems={"end"}>
                <Text fontSize="lg">
                  {formatCurrency(
                    formatUnits(token.toTokenAmount, token.toToken.decimals),
                    "USD",
                  )}
                </Text>
                <Text fontSize={"sm"} opacity={0.7}>
                  {Number(
                    formatUnits(
                      token.fromTokenAmount,
                      token.fromToken.decimals,
                    ),
                  ).toFixed(2)}{" "}
                  {token.fromToken.symbol}
                </Text>
              </Stack>
            </Td>
          </Tr>
        );
      })}
    </>
  );
  if (!tokenData?.length) {
    TableBody = (
      <>
        <Tr>
          <Td colSpan={2} textAlign={"center"} w="full">
            No tokens found
          </Td>
        </Tr>
      </>
    );
  }
  if (isLoading) {
    TableBody = (
      <>
        {Array.from(Array(3).keys()).map((i) => {
          return (
            <Tr key={i}>
              <Td>
                <Skeleton height="20px" rounded={"md"} />
              </Td>
              <Td>
                <Skeleton height="20px" rounded={"md"} />
              </Td>
            </Tr>
          );
        })}
      </>
    );
  }

  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Token</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>{TableBody}</Tbody>
      </Table>
    </TableContainer>
  );
};
