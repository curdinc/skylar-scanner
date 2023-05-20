import { useRouter } from "next/router";

import { api } from "~/utils/api";
import CopyClipboard from "~/components/CopyClipboard";
import { DataTable } from "../../../Table";

export const UserOpPage = () => {
  const {
    query: { transactionId, chainId },
  } = useRouter();
  const { data, refetch } = api.evmTransaction.userOpInfo.useQuery(
    {
      chainId: "1",
      txn: "0xec7e449e255bf5d722a9a6c742270d52876de0f3a7e024e955b53bdb331865dd",
    },
    { enabled: false },
  );
  console.log("chainId", chainId);
  console.log("transactionId", transactionId);
  console.log("data", data);

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
