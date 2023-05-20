import { useRouter } from "next/router";

import CopyClipboard from "~/components/CopyClipboard";
import { DataTable } from "../../../Table";

export const UserOpPage = () => {
  const {
    query: { transactionId, chainId },
  } = useRouter();
  console.log("chainId", chainId);
  console.log("transactionId", transactionId);
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
