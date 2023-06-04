import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Center, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { formatUnits } from "viem";

import {
  EvmTransactionClientQuerySchema,
  type transactionType,
} from "@skylar-scanner/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { formatDateSince } from "~/utils/date";
import CopyClipboard from "~/components/CopyClipboard";
import { AccordianTable } from "~/components/Table";
import TransactionCost from "~/components/TransactionCost";

type infoArrayType = {
  Name: string;
  Data: string;
};

type nftType = {
  From: string;
  To: string;
  Amount: string;
};

type tokenType = {
  From: string;
  To: string;
  Amount: string;
};
export const BundleTransactionPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [error, setError] = useState("");
  const [timeDiff, setTimeDiff] = useState("");
  const [moreInfoArray, setMoreInfoArray] = useState<infoArrayType[]>([]);
  const [nftArray, setNftArray] = useState<nftType[]>([]);
  const [tokenArray, setTokenArray] = useState<tokenType[]>([]);
  const context = api.useContext();
  const [userOpData, setUserOpData] = useState<transactionType | undefined>(
    undefined,
  );
  const isLoading = !userOpData && !error;

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
          setUserOpData(result);
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
    if (userOpData) {
      setMoreInfoArray([
        {
          Name: "Block Number",
          Data: Number(userOpData?.blockNumber).toString(),
        },
        {
          Name: "Nonce",
          Data: userOpData.nonce.toString(),
        },
        {
          Name: "Gas Data",
          Data:
            "Base fee of " +
            Number(userOpData.gasData.baseFeePerGas).toFixed(2).toString() +
            " Gwei with " +
            Number(userOpData.gasData.tipFeePerGas).toFixed(2).toString() +
            " Gwei of tip, capped at " +
            Number(userOpData.gasData.maxFeePerGas).toFixed(2).toString(),
        },
      ]);

      const newNFTArray: nftType[] = [];
      userOpData.nfts.forEach((item) => {
        newNFTArray.push({
          From: item.from,
          To: item.to,
          Amount: item.amount.toString(),
        });
      });
      setNftArray(newNFTArray);

      const newTokenArray: tokenType[] = [];
      userOpData.tokens.forEach((item) => {
        newTokenArray.push({
          From: item.from,
          To: item.to,
          Amount: Number(formatUnits(item.amount, item.decimals))
            .toFixed(3)
            .toString(),
        });
      });
      setTokenArray(newTokenArray);

      setTimeDiff(formatDateSince(userOpData.timestamp.getTime()));
    }
  }, [userOpData]);

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

  console.log(userOpData);

  return (
    <Box
      width="100vw"
      padding="10"
      sx={{ display: "flex", flexDirection: "column", gap: "6" }}
    >
      <CopyClipboard
        value={userOpData?.txnHash ? userOpData?.txnHash : ""}
        size={"2xl"}
        header
      />

      {userOpData && (
        <Text marginTop={"-4"}>
          UserOp submitted {timeDiff} ago by bundler address
        </Text>
      )}

      <Box width={"100%"} maxWidth={"lg"}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Entry point contract
          </Heading>
          {/* TODO */}
          <CopyClipboard
            value={userOpData?.to ? userOpData?.to : ""}
            size="md"
          />
        </Flex>

        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Transaction cost
          </Heading>
          {userOpData && (
            <TransactionCost
              size="md"
              popoverDetails={`${userOpData?.gasData.gasUsed} out of ${
                userOpData?.gasData.gasLimit
              } @ ${Number(userOpData?.gasData.gasPrice).toFixed(
                2,
              )} gwei / gas.`}
              copy={""}
              cost={formatCurrency(userOpData.gasData.usdcPricePaid, "USD")}
            />
          )}
        </Flex>
      </Box>

      {/* More info */}
      <AccordianTable headers={[]} title="More info" data={moreInfoArray} />

      {/* NFTs */}
      {userOpData && (
        <AccordianTable
          headers={
            userOpData?.nfts && userOpData?.nfts.length > 0
              ? ["From", "To", "Amount"]
              : []
          }
          title={`NFTs [ ${userOpData?.nfts.length} ]`}
          data={nftArray}
        />
      )}

      {/* Tokens */}
      {userOpData && (
        <AccordianTable
          headers={
            userOpData?.tokens && userOpData?.tokens.length > 0
              ? ["From", "To", "Amount"]
              : []
          }
          title={`Tokens [ ${userOpData?.tokens.length} ]`}
          data={tokenArray}
        />
      )}
    </Box>
  );
};
