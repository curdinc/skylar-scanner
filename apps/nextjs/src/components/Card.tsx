import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";

interface ICardProps {
  imageUrl: string;
  name: string;
  price: string;
  bestOffer: string;
}

const Card: React.FC<ICardProps> = ({ imageUrl, name, price, bestOffer }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden" boxShadow="sm">
      <Image src={imageUrl} alt="NFT" />
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold">
          {name}
        </Text>
        <Text fontSize="md">{price}</Text>
        <Text fontSize="sm" color="gray.500">
          {bestOffer}
        </Text>
      </Box>
    </Box>
  );
};

export default Card;
