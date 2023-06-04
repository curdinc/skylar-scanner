import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Center,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { Priority, useKBar } from "kbar";

import {
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylar-scanner/schema/src/evmTransaction";

import { api } from "~/utils/api";
import bigintToString from "~/utils/bigintToString";
import { formatCurrency } from "~/utils/currency";
import { formatDateSince } from "~/utils/date";
import CopyClipboard from "~/components/CopyClipboard";
import { AccordianTable } from "~/components/Table";
import TransactionCost from "~/components/TransactionCost";
import { CurrentChainIdAtom } from "~/atoms/chain";

export const TransactionPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [currentChainId] = useAtom(CurrentChainIdAtom);
  const { query } = useKBar();
  const toast = useToast();
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

  useEffect(() => {
    query.registerActions([
      {
        id: "Copy Transaction Hash",
        name: "Copy Transaction Hash",
        shortcut: ["c", "h"],
        keywords: "copy transaction hash",
        priority: Priority.HIGH,
        section: "Transaction",
        perform: () => {
          navigator.clipboard
            .writeText(transactionInfo?.txnHash || "")
            .catch((e) => {
              console.error(
                "ERROR: something went wrong copying to clipboard: ",
                e,
              );
            });
          toast({
            title: "Copied transaction hash",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
      },
      {
        id: "Copy From Address",
        name: "Copy From Address",
        shortcut: ["c", "f"],
        keywords: "copy From address",
        priority: Priority.HIGH,
        section: "Transaction",
        perform: () => {
          navigator.clipboard
            .writeText(transactionInfo?.from || "")
            .catch((e) => {
              console.error(
                "ERROR: something went wrong copying to clipboard: ",
                e,
              );
            });
          toast({
            title: "Copied From Address",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
      },

      {
        id: "Copy To Address",
        name: "Copy To Address",
        shortcut: ["c", "t"],
        keywords: "copy to address",
        priority: Priority.HIGH,
        section: "Transaction",
        perform: () => {
          navigator.clipboard
            .writeText(transactionInfo?.to || "")
            .catch((e) => {
              console.error(
                "ERROR: something went wrong copying to clipboard: ",
                e,
              );
            });
          toast({
            title: "Copied To address",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
      },
      {
        id: "Copy Input Data",
        name: "Copy Input Data",
        shortcut: ["c", "i"],
        keywords: "copy transaction input data",
        priority: Priority.HIGH,
        section: "Transaction",
        perform: () => {
          navigator.clipboard
            .writeText(transactionInfo?.rawInput || "")
            .catch((e) => {
              console.error(
                "ERROR: something went wrong copying to clipboard: ",
                e,
              );
            });
          toast({
            title: "Copied input data",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
      },
    ]);
  }, [transactionInfo, query, toast]);

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
          <Text>
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
              cost={formatCurrency(
                transactionInfo.gasData.usdcPricePaid,
                "USD",
              )}
              copy={""}
              size="md"
            />
          )}
        </Flex>
      </Stack>

      {/* NFTs */}
      {transactionInfo?.nfts && transactionInfo?.nfts.length && (
        <AccordianTable
          headers={["From", "To", "NFT", "Amount"]}
          title={`NFTs [ ${transactionInfo.nfts.length} ]`}
          data={transactionInfo.nfts.map((item) => {
            return {
              From: item.from,
              To: item.to,
              NFT: item.name,
              Amount: item.amount.toString(),
            };
          })}
        />
      )}

      {/* Tokens */}
      {transactionInfo?.tokens && transactionInfo?.tokens.length && (
        <AccordianTable
          headers={["From", "To", "Amount"]}
          title={`Tokens [ ${transactionInfo.tokens.length} ]`}
          data={transactionInfo.tokens.map((item) => {
            return {
              From: item.from,
              To: item.to,
              Amount: bigintToString(item.amount, item.decimals),
            };
          })}
        />
      )}

      {/* More info */}
      <AccordianTable
        headers={[]}
        title="More info"
        data={[
          { Name: "Block Number", Data: transactionInfo.blockNumber },
          {
            Name: "Nonce",
            Data: transactionInfo.nonce,
          },
          {
            Name: "Gas Data / gas",
            Data:
              "Base fee of " +
              Number(transactionInfo.gasData.baseFeePerGas)
                .toFixed(2)
                .toString() +
              " Gwei with " +
              Number(transactionInfo.gasData.tipFeePerGas)
                .toFixed(2)
                .toString() +
              " Gwei of tip, capped at " +
              Number(transactionInfo.gasData.maxFeePerGas)
                .toFixed(2)
                .toString() +
              "Gwei ",
          },
        ]}
      />
    </Stack>
  );
};
