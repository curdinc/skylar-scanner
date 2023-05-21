import { generateOpenApiDocument } from "trpc-openapi";

import { env } from "../env.mjs";
import { openApiRouter } from "./root";

export const openApiDocument = generateOpenApiDocument(openApiRouter, {
  title: "Skylar Scanner API",
  version: "0.0.0",
  baseUrl: env.BASE_OPENAPI_URL,
});
