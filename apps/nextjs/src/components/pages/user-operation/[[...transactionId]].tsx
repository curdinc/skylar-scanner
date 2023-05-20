import { useRouter } from "next/router";
import { DataTable } from "../../Table";

export const UserOpPage = () => {
  const {
    query: { transactionId },
  } = useRouter();
  console.log("transactionId", transactionId);
  return <div>
    <DataTable />
  </div>;
};
