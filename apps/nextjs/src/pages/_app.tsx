import type { AppType } from "next/app";
import {
  ChakraProvider,
  extendTheme,
  type StyleFunctionProps,
  type ThemeConfig,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Montserrat, Poppins } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";
import { KBarSearchPopUp, KBarSearchProvider } from "~/components/SearchBar";
import "../styles/globals.css";

const montserrat = Montserrat({ subsets: ["latin-ext"], display: "swap" });
const poppins = Poppins({
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
  display: "swap",
  subsets: ["latin-ext"],
});

const fonts = {
  heading: poppins.style.fontFamily,
  body: montserrat.style.fontFamily,
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// https://palette.saas-ui.dev/
const colors = {
  black: "#202225",
  white: "#CCD7DA",
  brandPrimary: "#DCAD52",
  gray: {
    "50": "#f9fafa",
    "100": "#f1f1f2",
    "200": "#e7e7e8",
    "300": "#d3d4d4",
    "400": "#acadae",
    "500": "#7e7f81",
    "600": "#535557",
    "700": "#353739",
    "800": "#1e2023",
    "900": "#181a1c",
  },
  yellow: {
    "50": "#fefefc",
    "100": "#fbf9ee",
    "200": "#f5edcc",
    "300": "#ede0a4",
    "400": "#e1cc6b",
    "500": "#bda746",
    "600": "#978638",
    "700": "#76682c",
    "800": "#584e21",
    "900": "#49401b",
  },
  green: {
    "50": "#f5fdf9",
    "100": "#caf4df",
    "200": "#8de8b9",
    "300": "#50d691",
    "400": "#46bb7f",
    "500": "#3ca06d",
    "600": "#31855a",
    "700": "#266746",
    "800": "#205539",
    "900": "#1a452f",
  },
  teal: {
    "50": "#f0fcfc",
    "100": "#bef2f1",
    "200": "#7fe5e4",
    "300": "#4ed0ce",
    "400": "#42b1af",
    "500": "#389695",
    "600": "#2d7a79",
    "700": "#235f5e",
    "800": "#1d4f4e",
    "900": "#184140",
  },
  cyan: {
    "50": "#f3fbfd",
    "100": "#ceeff5",
    "200": "#b7e8f0",
    "300": "#9ddfeb",
    "400": "#51c3d8",
    "500": "#4ab4c6",
    "600": "#43a2b3",
    "700": "#378694",
    "800": "#2d6e79",
    "900": "#23555e",
  },
  blue: {
    "50": "#f1f7fc",
    "100": "#cbe0f4",
    "200": "#a5caed",
    "300": "#7ab1e4",
    "400": "#5298db",
    "500": "#4683bc",
    "600": "#3b6d9d",
    "700": "#2d5478",
    "800": "#254462",
    "900": "#1e3850",
  },
  purple: {
    "50": "#f8f6fd",
    "100": "#e4daf8",
    "200": "#d0bff2",
    "300": "#b298ea",
    "400": "#9d7ce4",
    "500": "#8257dd",
    "600": "#6c47bd",
    "700": "#593a9b",
    "800": "#492f7f",
    "900": "#36235e",
  },
  pink: {
    "50": "#fdf5f9",
    "100": "#f7d9e8",
    "200": "#f1b9d6",
    "300": "#e88ebc",
    "400": "#e16da9",
    "500": "#ca4b8d",
    "600": "#ad4179",
    "700": "#8d3562",
    "800": "#6e294c",
    "900": "#511e38",
  },
  orange: {
    "50": "#fdfaf7",
    "100": "#f8ebde",
    "200": "#f1d4b8",
    "300": "#e6b281",
    "400": "#d99351",
    "500": "#bb7e46",
    "600": "#9d6b3b",
    "700": "#7d552f",
    "800": "#634325",
    "900": "#51371e",
  },
  brand: {
    "50": "#fcf7ee",
    "100": "#f1deba",
    "200": "#e4c17c",
    "300": "#ca9f4b",
    "400": "#b58e43",
    "500": "#997839",
    "600": "#816530",
    "700": "#675126",
    "800": "#574520",
    "900": "#3f3117",
  },
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode("black", "white")(props),
      bg: mode("white", "black")(props),
    },
  }),
};

export const theme = extendTheme({
  fonts,
  colors,
  config,
  styles,
});

const MyApp: AppType<Record<string, unknown>> = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <ChakraProvider theme={theme}>
      <KBarSearchProvider>
        <KBarSearchPopUp />
        <Component {...pageProps} />
        <Analytics />
      </KBarSearchProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
