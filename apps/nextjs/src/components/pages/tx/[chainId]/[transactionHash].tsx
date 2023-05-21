import { useRouter } from "next/router";
import { Center, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import {
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { formatDateSince } from "~/utils/date";
import CopyClipboard from "~/components/CopyClipboard";
import TransactionCost from "~/components/TransactionCost";
import { CurrentChainIdAtom } from "~/atoms/chain";

export const TransactionPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [currentChainId] = useAtom(CurrentChainIdAtom);
  const {
    data: transactionInfo,
    isLoading,
    error,
  } = api.evmTransaction.transactionInfo.useQuery(
    {
      chainId: chainId ? EvmChainIdSchema.parse(chainId) : currentChainId,
      txnHash: transactionHash ? EthHashSchema.parse(transactionHash) : "0x",
    },
    {
      enabled: !!chainId && !!transactionHash,
    },
  );

  if (isLoading) {
    return (
      <Center flexGrow={1}>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return <Center flexGrow={1}>{error.message}</Center>;
  }

  console.log(transactionInfo);

  return (
    <Stack spacing={10} width="full" padding="10">
      <Stack>
        <CopyClipboard value={transactionInfo.txnHash} size={"2xl"} header />

        {transactionInfo && (
          <Text mt={"-4"}>
            Transaction submitted{" "}
            {formatDateSince(transactionInfo.timestamp.getTime())} ago by{" "}
            <CopyClipboard
              value={transactionInfo.from}
              size="md"
              display={"inline-flex"}
            />
          </Text>
        )}
      </Stack>

      <Stack width={"100%"} maxWidth={"lg"} spacing={5}>
        {transactionInfo.to && (
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md" fontWeight="semibold">
              Interacted With
            </Heading>
            <CopyClipboard value={transactionInfo.to} size="md" />
          </Flex>
        )}
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Transaction cost
          </Heading>
          {transactionInfo && (
            <TransactionCost
              popoverDetails={`${transactionInfo.gasData.gasUsed} of ${transactionInfo.gasData.gasLimit} units @ ${transactionInfo.gasData.gasPrice} gwei / gas`}
              copy={""}
              cost={formatCurrency(
                transactionInfo.gasData.usdcPricePaid,
                "USD",
              )}
              size="md"
            />
          )}
        </Flex>
      </Stack>
    </Stack>
  );
};
