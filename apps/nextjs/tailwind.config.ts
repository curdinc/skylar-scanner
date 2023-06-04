import type { Config } from "tailwindcss";

import baseConfig from "@skylar-scanner/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
