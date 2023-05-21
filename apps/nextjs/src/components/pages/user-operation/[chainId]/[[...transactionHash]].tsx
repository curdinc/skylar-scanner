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
import { formatUnits } from "viem";

import {
  EvmTransactionClientQuerySchema,
  type transactionType,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { formatEvmAddress } from "~/utils/blockchain";
import { formatDateSince } from "~/utils/date";
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

type nftType = {
  From: string;
  To: string;
  NFT: string;
  Amount: string;
};

type tokenType = {
  From: string;
  To: string;
  Amount: string;
};
export const UserOpPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [error, setError] = useState("");
  const context = api.useContext();
  const [userOpData, setUserOpData] = useState<transactionType | undefined>(
    undefined,
  );
  const [userOpArray, setUserOpArray] = useState<UserOpDataDisplayType[]>([]);
  const [moreInfoArray, setMoreInfoArray] = useState<moreInfoType[]>([]);
  const [nftArray, setNftArray] = useState<nftType[]>([]);
  const [tokenArray, setTokenArray] = useState<tokenType[]>([]);
  const [timeDiff, setTimeDiff] = useState("");
  const isLoading = !userOpData && !error;
  const router = useRouter();

  useEffect(() => {
    if (!chainId || !transactionHash) {
      return;
    }

    const result = EvmTransactionClientQuerySchema.safeParse({
      chainId,
      txnHash: transactionHash,
    });
    if (result.success) {
      console.log("check");

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
      Object.keys(userOpData.parsedInput).forEach((_item) => {
        const item = _item as keyof typeof userOpData.parsedUserOp;
        const type = userOpMap[item];
        const data =
          type == "address" ? (
            <Link
              color="cyan.600"
              onClick={() => {
                router
                  .push(`/parse/${userOpData.parsedUserOp[item]}`)
                  .catch((e) => {
                    console.log(
                      `Error routing to parse/${userOpData.parsedUserOp[item]}: `,
                      e,
                    );
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

      const newNFTArray: nftType[] = [];
      userOpData.nfts.forEach((item) => {
        newNFTArray.push({
          From: item.from,
          To: item.to,
          NFT: item.name,
          Amount: item.amount.toString(),
        });
      });
      setNftArray(newNFTArray);

      const newTokenArray: tokenType[] = [];
      userOpData.tokens.forEach((item) => {
        newTokenArray.push({
          From: item.from,
          To: item.to,
          Amount: formatUnits(item.amount, item.decimals),
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
          UserOp submitted {timeDiff} ago by SCW address
        </Text>
      )}
      <Box width={"100%"} maxWidth={"lg"}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Bundle Hash
          </Heading>
          <CopyClipboard
            value={userOpData?.bundleHash ? userOpData?.bundleHash : ""}
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
              )} gwei / gas. Sponsored by ${formatEvmAddress(
                userOpData.parsedUserOp.paymasterAndData &&
                  userOpData.parsedUserOp.paymasterAndData.slice(0, 42),
              )}`}
              copy={
                userOpData.parsedUserOp.paymasterAndData &&
                userOpData.parsedUserOp.paymasterAndData.slice(0, 42)
              }
              cost={Number(userOpData?.transactionCost).toFixed(
                3 -
                  Math.floor(
                    Math.log(Number(userOpData?.transactionCost)) /
                      Math.log(10),
                  ),
              )}
            />
          )}
        </Flex>
      </Box>

      {/* User OP  */}
      <AccordianTable
        headers={["Name", "Type", "Data"]}
        data={userOpArray}
        title="User op"
      />

      {/* More info */}
      <AccordianTable headers={[]} title="More info" data={moreInfoArray} />

      {/* NFTs */}
      {userOpData && (
        <AccordianTable
          headers={
            userOpData?.nfts && userOpData?.nfts.length > 0
              ? ["From", "To", "NFT", "Amount"]
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
