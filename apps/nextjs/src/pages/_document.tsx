// pages/_document.js

import { Head, Html, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

import { theme } from "./_app";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* 👇 Here's the script */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
