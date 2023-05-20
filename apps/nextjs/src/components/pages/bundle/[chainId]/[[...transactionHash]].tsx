import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Center, Spinner } from "@chakra-ui/react";

import {
  EvmTransactionClientQuerySchema,
  type EvmTransaction,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import CopyClipboard from "~/components/CopyClipboard";
import { DataTable } from "../../../Table";

export const BundleTransactionPage = () => {
  const {
    query: { transactionHash, chainId },
  } = useRouter();
  const [error, setError] = useState("");
  const context = api.useContext();
  const [userOpData, setUserOpData] = useState<EvmTransaction | undefined>(
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
    <div>
      <DataTable
        headers={["test", "Test2"]}
        data={[
          { name: "Maanav", age: "3" },
          { name: "Hans", age: "1" },
        ]}
      />
      <CopyClipboard value={"0x1231hj23j3j3jk3awwdaawd23123"} size="6xl" />
    </div>
  );
};
