import React from "react";
import { Box, Card, Image, Text } from "@chakra-ui/react";

interface CardProps {
  imageUrl: string;
  title: string;
}

const CustomCard: React.FC<CardProps> = ({ imageUrl, title }) => {
  return (
    <Card maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={imageUrl} alt={title} w="full" h={200} objectFit="cover" />
      <Box p="6">
        <Text fontSize="xl" fontWeight="bold" mt={2}>
          {title}
        </Text>
      </Box>
    </Card>
  );
};

export default CustomCard;
