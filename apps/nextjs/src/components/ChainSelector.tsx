import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { goerli, mainnet, polygon, polygonMumbai } from "viem/chains";
import { z } from "zod";

import { Ethereum, Polygon } from "~/assets/chainIcons";
import { CurrentChainIdAtom } from "~/atoms/chain";

export const ChainSelector = () => {
  const [currentChainId, setCurrentChainId] = useAtom(CurrentChainIdAtom);

  const chainToIcon: Record<number, JSX.Element> = {
    [mainnet.id]: <Ethereum className={"h-6 w-6 rounded-full"} />,
    [polygon.id]: <Polygon className={"h-6 w-6 rounded-full"} />,
    [goerli.id]: <Ethereum className={"h-6 w-6 rounded-full"} testnet />,
    [polygonMumbai.id]: <Polygon className={"h-6 w-6 rounded-full"} testnet />,
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Chain Selector"
        icon={chainToIcon[currentChainId]}
        variant="ghost"
        rounded={"full"}
      />
      <MenuList
        onClick={(e) => {
          if ("value" in e.target) {
            console.log("typeof e.target.value", typeof e.target.value);
            const chainId = z.coerce.number().safeParse(e.target.value);
            if (!chainId.success) {
              return;
            }
            setCurrentChainId(chainId.data);
          }
        }}
      >
        <MenuOptionGroup defaultValue="asc" title="Mainnets">
          <MenuItem
            icon={<Ethereum className={"h-6 w-6 rounded-full"} />}
            value={mainnet.id}
          >
            Ethereum
          </MenuItem>
          <MenuItem
            icon={<Polygon className={"h-6 w-6 rounded-full"} />}
            value={polygon.id}
          >
            Polygon
          </MenuItem>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup title="Testnets">
          <MenuItem
            value={goerli.id}
            icon={<Ethereum className={"h-6 w-6 rounded-full"} testnet />}
          >
            Goerli
          </MenuItem>
          <MenuItem
            value={polygonMumbai.id}
            icon={<Polygon className={"h-6 w-6 rounded-full"} testnet />}
          >
            Mumbai
          </MenuItem>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
