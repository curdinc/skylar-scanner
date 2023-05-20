import baseConfig from "@skylarScan/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
