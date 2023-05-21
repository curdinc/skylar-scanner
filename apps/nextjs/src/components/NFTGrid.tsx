import { Grid } from "@chakra-ui/react";

import Card from "~/components/Card";

export function NFTGrid() {
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
}
