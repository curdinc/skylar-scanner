import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Center, Flex, Heading, Spinner } from "@chakra-ui/react";

import {
  EvmTransactionClientQuerySchema,
  type EvmTransaction,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import CopyClipboard from "~/components/CopyClipboard";
import TransactionCost from "~/components/TransactionCost";

export const TransactionPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [error, setError] = useState("");
  const context = api.useContext();
  const [transactionInfo, setTransactionInfo] = useState<
    EvmTransaction | undefined
  >(undefined);
  const isLoading = !transactionInfo && !error;

  const [timeDiff, setTimeDiff] = useState("");

  useEffect(() => {
    if (!chainId || !transactionHash) {
      return;
    }
    const result = EvmTransactionClientQuerySchema.safeParse({
      chainId,
      txnHash: transactionHash,
    });
    if (result.success) {
      context.evmTransaction.transactionInfo
        .fetch({
          chainId: result.data.chainId,
          txnHash: result.data.txnHash[0] ?? "0x",
        })
        .then((result) => {
          setTransactionInfo(result);
        })
        .catch((e) => {
          console.error("Error fetching user operation info", e);
          if (e instanceof Error) {
            setError(e.message);
          }
        });
    } else {
      setError("Invalid chain or transaction hash");
    }
  }, [chainId, transactionHash, context]);

  useEffect(() => {
    // setTimeDiff(formatDateSince(transactionInfo.timestamp.getTime()));
  }, []);

  if (isLoading) {
    return (
      <Center flexGrow={1}>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return <Center flexGrow={1}>{error}</Center>;
  }

  console.log(transactionInfo);

  return (
    <Box
      width="100%"
      padding="10"
      sx={{ display: "flex", flexDirection: "column", gap: "6" }}
    >
      <CopyClipboard
        value={transactionInfo?.hash ? transactionInfo?.hash : ""}
        size={"2xl"}
        header
      />

      {/* TODO add timestamp */}
      {/* {transactionInfo && (
        <Text marginTop={"-4"}>
          UserOp submitted {timeDiff} ago by SCW address
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
    </Box>
  );
};
