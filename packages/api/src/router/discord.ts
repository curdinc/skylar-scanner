import { TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";

import { env } from "../../env.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";

const emailSchema = z.string().email("Invalid email address");

export const discordRouter = createTRPCRouter({
  addToWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const parsedEmail = emailSchema.parse(input.email);
        const resp = await fetch(env.DISCORD_MAILING_LIST_WH, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `${ctx.abTest.landingPage} landing page, Email: ${parsedEmail}`,
          }),
        });
        if (!resp.ok) {
          const errorText = await resp.text();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error posting to discord!",
            cause: errorText,
          });
        }
        return JSON.stringify({ success: true });
      } catch (error) {
        if (error instanceof ZodError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid Email!",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unknown error occurred!",
          });
        }
      }
    }),
});
