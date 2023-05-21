import React, { useState } from "react";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import Card from "~/components/Card";

export const UserWalletPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Box p={4}>
      <Tabs isLazy index={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card
              title="tt"
              imageUrl="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            />
          </TabPanel>
          <TabPanel>Tab2</TabPanel>
          <TabPanel>Tab3</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
