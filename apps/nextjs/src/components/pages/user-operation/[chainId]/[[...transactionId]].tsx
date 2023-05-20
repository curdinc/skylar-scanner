import { useRouter } from "next/router";

import { DataTable } from "../../../Table";

export const UserOpPage = () => {
  const {
    query: { transactionId, chainId },
  } = useRouter();
  console.log("chainId", chainId);
  console.log("transactionId", transactionId);
  return (
    <div>
      <DataTable />
    </div>
  );
};
