import { atom } from "jotai";
import { mainnet } from "viem/chains";

export const CurrentChainIdAtom = atom<number>(mainnet.id);
