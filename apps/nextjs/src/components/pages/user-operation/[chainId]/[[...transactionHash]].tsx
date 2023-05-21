import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  EvmTransactionClientQuerySchema,
  type userOpType,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import CopyClipboard from "~/components/CopyClipboard";
import TransactionCost from "~/components/TransactionCost";
import dummyNFT from "~/NFTdummy.json";
import { DataTable } from "../../../Table";

export const UserOpPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [error, setError] = useState("");
  const context = api.useContext();
  const [userOpData, setUserOpData] = useState<userOpType | undefined>(
    undefined,
  );
  const isLoading = !userOpData && !error;
  const bgcolor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    if (!chainId || !transactionHash) {
      return;
    }

    const result = EvmTransactionClientQuerySchema.safeParse({
      chainId,
      txnHash: transactionHash,
    });
    if (result.success) {
      context.evmTransaction.userOpInfo
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

  if (isLoading) {
    return (
      <Center flexGrow={1}>
        <Spinner />
      </Center>
    );
  }
  console.log(transactionHash);
  console.log(userOpData);
  // userOpData.userOp

  if (error) {
    return <Center flexGrow={1}>{error}</Center>;
  }

  return (
    <Box width="100%" padding="10">
      <CopyClipboard
        value={transactionHash && transactionHash[0] ? transactionHash[0] : ""}
        size={"2xl"}
        header
      />

      <Box width={"100%"}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Bundle Hash
          </Heading>
          <CopyClipboard value={"0x1231hj23j3j3jk3awwdaawd23123"} size="md" />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Transaction cost
          </Heading>
          <TransactionCost data={userOpData} size="md" />
        </Flex>
      </Box>
      {/* Time is not there */}

      {/* User OP  */}
      <Box rounded="md" bg={bgcolor}>
        <Heading padding="5">User Op</Heading>
        <DataTable headers={["To", "From", "NFT", "Amount"]} data={dummyNFT} />
      </Box>
      <DataTable headers={["To", "From", "NFT", "Amount"]} data={dummyNFT} />
      <DataTable headers={["To", "From", "NFT", "Amount"]} data={dummyNFT} />
      <div></div>
    </Box>
  );
};
