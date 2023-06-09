import { authRouter } from "./router/auth";
import { discordRouter } from "./router/discord";
import { evmAddressRouter } from "./router/evmAddress";
import { evmTransactionRouter } from "./router/evmTransaction";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  discord: discordRouter,
  evmTransaction: evmTransactionRouter,
  evmAddress: evmAddressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const openApiRouter = createTRPCRouter({
  evmTransaction: evmTransactionRouter,
  // twilio: twilioRouter,
});
// export type definition of Open API
export type OpenApiRouter = typeof openApiRouter;
