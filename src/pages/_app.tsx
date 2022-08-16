import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
      {/* <DarkModeSwitch /> */}
    </ChakraProvider>
  );
}

export default MyApp;
