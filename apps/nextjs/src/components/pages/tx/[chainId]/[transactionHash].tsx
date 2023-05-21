import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Center, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import { useAtom } from "jotai";

import {
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
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

  const [timeDiff, setTimeDiff] = useState("");

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

  console.log(transactionInfo.);

  return (
    <Stack spacing={6} width="full" padding="10">
      <CopyClipboard
        value={transactionInfo?.txnHash ? transactionInfo?.txnHash : ""}
        size={"2xl"}
        header
      />

      {/* TODO add timestamp */}
      {/* {transactionInfo && (
        <Text marginTop={"-4"}>
          Transaction submitted {timeDiff} ago by SCW address
        </Text>
      )} */}

      <Box width={"100%"} maxWidth={"lg"}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Bundle Hash
          </Heading>
          <CopyClipboard
            value={transactionInfo?.to ? transactionInfo?.to : ""}
            size="md"
          />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Transaction cost
          </Heading>
          {transactionInfo && (
            // TODO add in cost
            <TransactionCost
              popoverDetails={`__ of __ units @ ${transactionInfo.gasPrice} gwei / gas`}
              copy={""}
              cost={"SOME VALUE LOL"}
              size="md"
            />
          )}
        </Flex>
      </Box>
    </Stack>
  );
};
