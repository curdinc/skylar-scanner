import { authRouter } from "./router/auth";
import { discordRouter } from "./router/discord";
import { evmTransactionRouter } from "./router/evmTransction";
import { postRouter } from "./router/post";
import { twilioRouter } from "./router/twilio";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  discord: discordRouter,
  evmTransaction: evmTransactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const openApiRouter = createTRPCRouter({
  twilio: twilioRouter,
});
// export type definition of Open API
export type OpenApiRouter = typeof openApiRouter;
