import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Center, Spinner } from "@chakra-ui/react";
import { z } from "zod";

import { EvmChainIdSchema } from "@skylarScan/schema";
import { type userOpType } from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import CopyClipboard from "~/components/CopyClipboard";
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

  useEffect(() => {
    if (!chainId || !transactionHash) {
      return;
    }

    const expectedSchema = z.object({
      chainId: EvmChainIdSchema,
      transactionHash: z.string().array().length(1),
    });
    const result = expectedSchema.safeParse({
      chainId,
      transactionHash,
    });
    if (result.success) {
      context.evmTransaction.userOpInfo
        .fetch({
          chainId: result.data.chainId,
          txn: result.data.transactionHash[0] ?? "",
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
