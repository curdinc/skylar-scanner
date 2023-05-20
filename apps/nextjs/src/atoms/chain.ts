import { atom } from "jotai";
import { mainnet } from "viem/chains";

import { type EvmChainIdType } from "@skylarScan/schema";

export const CurrentChainIdAtom = atom<EvmChainIdType>(
  mainnet.id.toString() as "1",
);
