import React from "react";
import { Box, Center, Image, Text } from "@chakra-ui/react";

interface ICardProps {
  imageUrl: string;
  name: string;
  price: string;
  imageHeight: string;
  imageWidth: string;
  imageFit: string;
}

const Card: React.FC<ICardProps> = ({
  imageUrl,
  name,
  price,
  imageHeight = "200px",
  imageWidth = "auto",
  imageFit = "contain",
}) => {
  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden" boxShadow="sm">
      <Center>
        <Image
          src={imageUrl}
          alt="NFT"
          height={imageHeight}
          width={imageWidth}
          objectFit={imageFit}
        />
      </Center>
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold">
          {name}
        </Text>
        <Text fontSize="md">{price}</Text>
      </Box>
    </Box>
  );
};

export default Card;
