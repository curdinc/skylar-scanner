import { parseAbi, parseAbiItem, parseAbiParameters } from "viem";

import { type EvmChainIdType } from "@skylarScan/schema";
import { type EthHashType } from "@skylarScan/schema/src/evmTransaction";

// constants
export const ENTRYPOINT_CONTRACT_ADDRESS =
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const USER_OPERATION_EVENT = parseAbiItem(
  "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
);
export const HANDLE_OPS_INPUT = parseAbiParameters(
  "(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary",
);

export const PARSER_ABI = parseAbi([
  "function decimals() view returns (uint8)",
  "function name() view returns (string memory)",
  "function symbol() view returns (string memory)",
]);

export const SIGNATURES: Record<string, EthHashType> = {
  USER_OPERATION:
    "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",
  ERC721_TRANSFER_OR_ERC20_TRANSFER:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  ERC1155_SINGLE_TRANSFER:
    "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
  ERC1155_MULTIPLE_TRANSFER:
    "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb",
};

export const ENTRY_POINT_CONTRACT_ADDRESSES: Record<
  EvmChainIdType,
  `0x${string}`[]
> = {
  "1": ["0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"],
  "5": ["0x0576a174D229E3cFA37253523E645A78A0C91B57"],
  "137": [],
  "80001": [],
};
