import { parseAbiItem, parseAbiParameters } from "viem";

// constants
export const ENTRYPOINT_CONTRACT_ADDRESS =
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const USER_OPERATION_EVENT = parseAbiItem(
  "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
);
export const HANDLE_OPS_INPUT = parseAbiParameters(
  "(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary",
);
