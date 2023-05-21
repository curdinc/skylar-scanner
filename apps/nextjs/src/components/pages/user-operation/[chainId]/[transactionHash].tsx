import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Center,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { Priority, useKBar } from "kbar";
import { formatUnits } from "viem";

import {
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import { formatEvmAddress } from "~/utils/blockchain";
import { formatCurrency } from "~/utils/currency";
import { formatDateSince } from "~/utils/date";
import CopyClipboard from "~/components/CopyClipboard";
import TransactionCost from "~/components/TransactionCost";
import { CurrentChainIdAtom } from "~/atoms/chain";
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
  const [currentChainId] = useAtom(CurrentChainIdAtom);
  const {
    data: userOpData,
    isLoading,
    error,
  } = api.evmTransaction.userOpInfo.useQuery({
    chainId: chainId ? EvmChainIdSchema.parse(chainId) : currentChainId,
    txnHash: transactionHash ? EthHashSchema.parse(transactionHash) : "0x",
  });

  const [userOpArray, setUserOpArray] = useState<UserOpDataDisplayType[]>([]);
  const [moreInfoArray, setMoreInfoArray] = useState<moreInfoType[]>([]);
  const [nftArray, setNftArray] = useState<nftType[]>([]);
  const [tokenArray, setTokenArray] = useState<tokenType[]>([]);
  const router = useRouter();

  const { query } = useKBar();
  const toast = useToast();
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
            .writeText(userOpData?.userOpHash || "")
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
          navigator.clipboard.writeText(userOpData?.sender || "").catch((e) => {
            console.error(
              "ERROR: something went wrong copying to clipboard: ",
              e,
            );
          });
          toast({
            title: "Copied From hash",
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
            .writeText(userOpData?.rawUserOp || "")
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
  }, [userOpData, query, toast]);

  useEffect(() => {
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
          Name: "Gas Data / gas",
          Data:
            "Base fee of " +
            Number(userOpData.gasData.baseFeePerGas).toFixed(2).toString() +
            " Gwei with " +
            Number(userOpData.gasData.tipFeePerGas).toFixed(2).toString() +
            " Gwei of tip, capped at " +
            Number(userOpData.gasData.maxFeePerGas).toFixed(2).toString() +
            " Gwei",
        },
      ]);

      const newNFTArray: nftType[] = [];
      userOpData.nfts.forEach((item) => {
        newNFTArray.push({
          From: item.from,
          To: item.to,
          // NFT: item.name,
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
    }
  }, [router, userOpData]);

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

  return (
    <Stack spacing={10} width="full" padding="10">
      <Stack>
        <CopyClipboard value={userOpData.userOpHash} size={"2xl"} header />

        <Text>
          User Operation submitted{" "}
          {formatDateSince(userOpData.timestamp.getTime())} ago by{" "}
          <CopyClipboard
            value={userOpData.sender}
            size="md"
            display={"inline-flex"}
          />
        </Text>
      </Stack>

      <Stack width={"100%"} maxWidth={"lg"} spacing={5}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" fontWeight="semibold">
            Bundle Hash
          </Heading>
          <CopyClipboard value={userOpData.bundleHash} size="md" />
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
                userOpData.parsedUserOp.paymasterAndData.slice(0, 42),
              )}`}
              copy={userOpData.parsedUserOp.paymasterAndData.slice(0, 42)}
              cost={formatCurrency(userOpData.transactionCost, "USD")}
            />
          )}
        </Flex>
      </Stack>

      {/* NFTs */}
      {userOpData.nfts && userOpData.nfts.length && (
        <AccordianTable
          headers={["From", "To", "Amount"]}
          title={`NFTs [ ${userOpData.nfts.length} ]`}
          data={nftArray}
        />
      )}

      {/* Tokens */}
      {userOpData.tokens && userOpData.tokens.length > 0 && (
        <AccordianTable
          headers={["From", "To", "Amount"]}
          title={`Tokens [ ${userOpData.tokens.length} ]`}
          data={tokenArray}
        />
      )}

      {/* User OP  */}
      <AccordianTable
        headers={["Name", "Type", "Data"]}
        data={userOpArray}
        title="User op"
      />

      {/* More info */}
      <AccordianTable headers={[]} title="More info" data={moreInfoArray} />
    </Stack>
  );
};
