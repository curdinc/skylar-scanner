import { z } from "zod";

export const TestSchema = z.enum(["simple", "full"]);
export type TestType = z.infer<typeof TestSchema>;
