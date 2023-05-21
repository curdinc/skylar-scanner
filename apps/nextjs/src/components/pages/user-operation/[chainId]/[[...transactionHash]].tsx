import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Flex,
  Heading,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";

import {
  EvmTransactionClientQuerySchema,
  type userOpType,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import CopyClipboard from "~/components/CopyClipboard";
import TransactionCost from "~/components/TransactionCost";
import { AccordianTable } from "../../../Table";

type UserOpDataDisplayType = {
  Name: string;
  Type: string;
  Data: string | JSX.Element | bigint;
};
type moreInfoType = {
  Name: string;
  Data: string;
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
  const [moreInfoArray, setMoreInfoArray] = useState<moreInfoType[]>([]);
  const [timeDiff, setTimeDiff] = useState("");
  const isLoading = !userOpData && !error;
  const router = useRouter();
  const curDate = new Date().getTime();

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

      setMoreInfoArray([
        {
          Name: "beneficiary",
          Data: userOpData.beneficiary,
        },
        {
          Name: "Entry Point Contract",
          Data: userOpData.entryPointContract,
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

      const ms = curDate - userOpData.timestamp.getTime();
      let timeDiff = 0;
      let unit = "";
      if (ms >= 2592000000) {
        timeDiff = Math.floor(ms / 2592000000);
        unit = " month";
      } else if (ms >= 604800000) {
        timeDiff = Math.floor(ms / 604800000);
        unit = " week";
      } else if (ms >= 86400000) {
        timeDiff = Math.floor(ms / 86400000);
        unit = " day";
      } else if (ms >= 3600000) {
        timeDiff = Math.floor(ms / 3600000);
        unit = " hour";
      } else {
        timeDiff = Math.floor(ms / 3600000);
        unit = " minute";
      }
      // setTimeDiff();
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
      sx={{ display: "flex", flexDirection: "column", gap: "6" }}
    >
      <CopyClipboard
        value={userOpData?.userOpHash ? userOpData?.userOpHash : ""}
        size={"2xl"}
        header
      />

      {userOpData && (
        <Text marginTop={"-4"}>
          UserOp submitted {} minutes ago by SCW address
        </Text>
      )}

      <Box width={"100%"} maxWidth={"lg"}>
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
      <AccordianTable
        headers={["Name", "Type", "Data"]}
        data={userOpArray}
        title="User op"
      />

      {/* More info */}
      <AccordianTable headers={[]} title="More info" data={moreInfoArray} />
      {/* <Box rounded="lg" bg={bgcolor}>
        <Accordion defaultIndex={[0]} rounded="md" allowMultiple>
          <AccordionItem>
            <h1>
              <AccordionButton>
                <Box
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontSize="3xl"
                  fontWeight="bold"
                  padding="5"
                >
                  User Op
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h1>
            <AccordionPanel pb={4}>
              <DataTable
                headers={["Name", "Type", "Data"]}
                data={userOpArray}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box> */}

      <div></div>
    </Box>
  );
};
