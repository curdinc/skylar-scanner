import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Flex,
  Heading,
  Link,
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

type UserOpDataDisplayType = {
  Name: string;
  Type: string;
  Data: string | JSX.Element | bigint;
};
export const UserOpPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [error, setError] = useState("");
  const context = api.useContext();
  const [userOpData, setUserOpData] = useState<userOpType | undefined>(
    undefined,
  );
  const [userOpArray, setUserOpArray] = useState<UserOpDataDisplayType[]>([]);
  const isLoading = !userOpData && !error;
  const router = useRouter();
  const bgcolor = useColorModeValue("gray.100", "darkColor.500");

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

  const userOpMap = {
    sender: "address",
    nonce: "uint256",
    initCode: "bytes",
    callData: "bytes",
    callGasLimit: "uint256",
    verificationGasLimit: "uint256",
    preVerificationGas: "uint256",
    maxFeePerGas: "uint256",
    maxPriorityFeePerGas: "uint256",
    paymasterAndData: "bytes",
    signature: "bytes",
  };

  useEffect(() => {
    const userDataArray: UserOpDataDisplayType[] = [];
    if (userOpData) {
      Object.keys(userOpData.parsedUserOp).forEach((_item) => {
        const item = _item as keyof typeof userOpData.parsedUserOp;
        const type = userOpMap[item];
        const data =
          type == "address" ? (
            <Link
              color="cyan.600"
              onClick={() => {
                router.push(`/parse/${type}`).catch((e) => {
                  console.log(`Error routing to parse/${type}: `, e);
                });
              }}
            >
              {userOpData.parsedUserOp[item].toString()}
            </Link>
          ) : (
            userOpData.parsedUserOp[item]
          );

        userDataArray.push({
          Name: item,
          Type: type,
          Data: data,
        });
      });
      setUserOpArray(userDataArray);
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

  return (
    <Box
      width="100%"
      padding="10"
      sx={{ display: "flex", flexDirection: "column", gap: "8" }}
    >
      <CopyClipboard
        value={userOpData?.userOpHash ? userOpData?.userOpHash : ""}
        size={"2xl"}
        header
      />

      <Box width={"100%"}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Bundle Hash
          </Heading>
          {/* TODO fill in */}
          <CopyClipboard value={"0x1231hj23j3j3jk3awwdaawd23123"} size="md" />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Transaction cost
          </Heading>
          {userOpData && <TransactionCost data={userOpData} size="md" />}
        </Flex>
      </Box>
      {/* Time is not there */}

      {/* User OP  */}
      <Box rounded="md" bg={bgcolor}>
        <Heading padding="5" paddingBottom="2" size="lg">
          User Op
        </Heading>
        <DataTable headers={["Name", "Type", "Data"]} data={userOpArray} />
      </Box>

      <div></div>
    </Box>
  );
};
