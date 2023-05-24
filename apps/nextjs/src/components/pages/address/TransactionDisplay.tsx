import {
  Center,
  Link,
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

import {
  type EthAddressType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { formatEvmAddress } from "~/utils/blockchain";

export const TransactionDisplay = ({
  address,
  chainId,
}: {
  address: EthAddressType;
  chainId: EvmChainIdType;
}) => {
  const {
    data: transactionData,
    isLoading,
    error,
  } = api.evmTransaction.userRecentTxns.useQuery(
    {
      chainId,
      sender: address,
    },
    {
      enabled: address !== "0x",
    },
  );

  console.log("transactionData", transactionData);
  console.log("isLoading", isLoading);
  console.log("error", error);

  if (error) {
    return <Center flexGrow={1}>{error.message}</Center>;
  }

  let TableBody = (
    <>
      {transactionData?.map((txn) => {
        return (
          <Tr key={txn.userOp}>
            <Td>
              <Stack w="full" alignItems={"end"}>
                <Link
                  href={`/user-operation/${chainId}/${txn.userOp}`}
                  fontSize="lg"
                >
                  {formatEvmAddress(txn.userOp)}
                </Link>
              </Stack>
            </Td>
            <Td>
              <Stack w="full" alignItems={"end"}>
                <Text fontSize="lg">{txn.gasUsdcPricePaid}</Text>
              </Stack>
            </Td>
            <Td>
              <Stack w="full" alignItems={"end"}>
                <Text fontSize="lg">{txn.time.toISOString()}</Text>
              </Stack>
            </Td>
            <Td>
              <Stack w="full" alignItems={"end"}>
                <Link
                  href={`/bundle/${chainId}/${txn.bundleHash}`}
                  fontSize="lg"
                >
                  {formatEvmAddress(txn.bundleHash)}
                </Link>
              </Stack>
            </Td>
          </Tr>
        );
      })}
    </>
  );
  if (!transactionData?.length) {
    TableBody = (
      <>
        <Tr>
          <Td colSpan={2} textAlign={"center"} w="full">
            No transactions found
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
    <>
      <div>Transactions made within the last 14 days</div>
      <TableContainer>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>UserOp</Th>
              <Th isNumeric>Amount</Th>
              <Th>Date</Th>
              <Th>BundleHash</Th>
            </Tr>
          </Thead>
          <Tbody>{TableBody}</Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
