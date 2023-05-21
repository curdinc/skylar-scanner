import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  HStack,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import Card from "~/components/Card";
import SortableTable from "~/components/SortableTable";

export const UserWalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  return (
    <Container maxW="container.lg" mt={10}>
      <Flex align="center" mb={6}>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="User Avatar"
          boxSize={120}
          borderRadius="full"
        />
        <Text ml={4} fontSize="2xl" fontWeight="bold">
          User's NFT Collection
        </Text>
      </Flex>
      <Tabs isLazy index={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            <SortableTable />
          </TabPanel>
          <TabPanel>Tab3</TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
