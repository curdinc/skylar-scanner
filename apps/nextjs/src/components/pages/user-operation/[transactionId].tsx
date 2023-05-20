import { useRouter } from "next/router";

export const UserOpPage = () => {
  const {
    query: { transactionId },
  } = useRouter();
  console.log("transactionId", transactionId);
  return <div>UserOpPage</div>;
};
