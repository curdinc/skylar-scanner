import {
  createPublicClient,
  decodeAbiParameters,
  http,
  parseAbiItem,
  parseAbiParameters,
} from "viem";
import { z } from "zod";

import {
  EthAddressSchema,
  EthHashSchema,
  EvmChainIdSchema,
} from "@skylarScan/schema";

import { env } from "../../env.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const evmTransactionRouter = createTRPCRouter({
  getUserOp: publicProcedure
    .input(z.object({ txn: EthHashSchema, chainId: EvmChainIdSchema }))
    .query(async ({ ctx, input }) => {
      const searchQuery = input.txn;

      // TODO: Branch based on chainId
      const transport = http(`https://mainnet.infura.io/v3/${env.INFURA_KEY}`);
      const client = createPublicClient({
        transport: transport,
      });

      const epca = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
      const UserOperationEvent = parseAbiItem(
        "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
      );

      const UserOperationInput = parseAbiParameters(
        "(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary",
      );

      const filter = await client.createEventFilter({
        address: epca,
        event: UserOperationEvent,
        fromBlock: 17296100n,
        toBlock: 17296133n,
        args: [searchQuery],
      });
      const logs = await client.getFilterLogs({ filter });
      console.log(logs);

      const parentHash = logs[0]?.transactionHash;
      console.log("parentHash", parentHash);

      if (!parentHash) {
        console.error("parentHash not defined");
        return;
      }

      const txnView = await client.getTransaction({ hash: parentHash });
      console.log("txnView", txnView);

      const inp = txnView.input;
      console.log("inp", inp);

      const parseInp: `0x${string}` = `0x${txnView.input.slice(10)}`;
      console.log("parseInp", parseInp);

      const vals = decodeAbiParameters(UserOperationInput, parseInp);
      console.log("vals", vals);

      const res = await client.getBlockNumber();
      console.log(res);
      // TODO
      return {};
    }),
  getBundle: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
  getTransaction: publicProcedure
    .input(z.object({ txn: EthHashSchema, chainId: EvmChainIdSchema }))
    .query(async ({ ctx, input }) => {
      // TODO: Branch based on chainId
      const transport = http(`https://mainnet.infura.io/v3/${env.INFURA_KEY}`);
      const client = createPublicClient({
        transport: transport,
      });

      const transaction = await client.getTransaction({ hash: input.txn });
      return transaction;
    }),
  parseSearchQuery: publicProcedure
    .input(z.object({ query: z.string(), chainId: EvmChainIdSchema }))
    .mutation(async ({ input }) => {
      const { query } = input;
      const addressParse = EthAddressSchema.safeParse(query);
      const txnParse = EthHashSchema.safeParse(query);
      if (addressParse.success) {
        // TODO
      }
      if (txnParse.success) {
        const transport = http(
          `https://mainnet.infura.io/v3/${env.INFURA_KEY}`,
        );
        const client = createPublicClient({
          transport: transport,
        });
        const txn = await client.getTransaction({ hash: txnParse.data });
        console.log("txn", txn);
      }
    }),
});
