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

  const formattedData = nftData?.nfts.ownedNfts.map((ownedNft) => {
    return {
      imageUrl: ownedNft?.media[0]?.gateway,
      name: ownedNft?.title,
      price: ownedNft?.contract.openSea?.floorPrice,
    };
  });
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={4}>
      {formattedData?.map((nft) => (
        <Card imageUrl={nft.imageUrl} name={nft.name} price={nft.price} />
      ))}
    </Grid>
  );
};
