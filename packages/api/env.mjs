import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    BASE_OPENAPI_URL: z.string().url(),
    DISCORD_MAILING_LIST_WH: z.string().url(),
    INFURA_KEY: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // DONT ADD ANYTHING HERE
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    BASE_OPENAPI_URL: process.env.BASE_OPENAPI_URL,
    DISCORD_MAILING_LIST_WH: process.env.DISCORD_MAILING_LIST_WH,
    INFURA_KEY: process.env.INFURA_KEY,
  },
});
