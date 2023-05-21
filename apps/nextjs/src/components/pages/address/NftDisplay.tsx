import { Center, Grid } from "@chakra-ui/react";

import {
  type EthAddressType,
  type EvmChainIdType,
} from "@skylarScan/schema/src/evmTransaction";

import { api } from "~/utils/api";
import Card from "~/components/Card";

export const NftDisplay = ({
  address,
  chainId,
}: {
  address: EthAddressType;
  chainId: EvmChainIdType;
}) => {
  const {
    data: nftData,
    isFetching,
    error,
  } = api.evmAddress.nfts.useQuery(
    {
      address,
      chainId,
    },
    {
      enabled: address !== "0x",
    },
  );

  console.log("nftData", nftData);
  console.log("isFetching", isFetching);
  console.log("error", error);

  if (error) {
    return <Center flexGrow={1}>{error.message}</Center>;
  }

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <Card
        imageUrl="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        name="NFT"
        price="11 ETH"
        bestOffer="2"
      />
      <Card
        imageUrl="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        name="NFT"
        price="11 ETH"
        bestOffer="2"
      />
      <Card
        imageUrl="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        name="NFT"
        price="11 ETH"
        bestOffer="2"
      />
    </Grid>
  );
};
