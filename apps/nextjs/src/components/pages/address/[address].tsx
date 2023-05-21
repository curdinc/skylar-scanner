import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Center,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import { EthAddressSchema } from "@skylarScan/schema";

import { api } from "~/utils/api";
import SortableTable from "~/components/SortableTable";
import { CurrentChainIdAtom } from "~/atoms/chain";
import { NftDisplay } from "./NftDisplay";
import { UserAvatar } from "./UserAvatar";

export const UserWalletPage: React.FC = () => {
  const {
    query: { address: _address },
  } = useRouter();
  const address = _address ? EthAddressSchema.parse(_address) : "0x";
  const [chainId] = useAtom(CurrentChainIdAtom);
  const {
    data: addressData,
    isFetching,
    error,
  } = api.evmAddress.addressDetails.useQuery(
    {
      address,
    },
    {
      enabled: address !== "0x",
    },
  );

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  if (error) {
    return <Center flexGrow={1}>{error.message}</Center>;
  }

  return (
    <Container maxW="container.lg" mt={10}>
      <UserAvatar
        address={address}
        ensAvatar={addressData?.addressDetails?.ensAvatar ?? undefined}
        ensName={addressData?.addressDetails?.ensName}
        isLoading={isFetching || address === "0x"}
      />
      <Tabs isLazy index={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>NFTs</Tab>
          <Tab>Tokens</Tab>
          <Tab>Transactions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <NftDisplay address={address} chainId={chainId} />
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
