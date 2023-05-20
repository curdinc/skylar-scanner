import { Link } from "@chakra-ui/next-js";
import { Center, Heading, Stack } from "@chakra-ui/react";

export const NotFoundPage = () => {
  return (
    <Center flexGrow={1}>
      <Stack spacing={5} alignItems={"center"}>
        <Heading>Uh Oh, we couldn&apos;t find that page</Heading>
        <Link href="/">Head home instead</Link>
      </Stack>
    </Center>
  );
};
