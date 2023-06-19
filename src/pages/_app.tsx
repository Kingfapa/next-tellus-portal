import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import App, { AppContext } from 'next/app'



function MyApp({ Component, pageProps, version, NODE_ENV }: AppProps & { version: string, NODE_ENV: string }) {
  console.debug({ version, NODE_ENV });
  return (
    <ChakraProvider>
      <Component {...pageProps} />
      {/* <DarkModeSwitch /> */}
    </ChakraProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)

  if (appContext.ctx.res?.statusCode === 404) {
    appContext.ctx.res.writeHead(302, { Location: '/' })
    appContext.ctx.res.end()
    return
  }


  return { ...appProps, version: process.env.npm_package_version, NODE_ENV: process.env.NODE_ENV }
}

export default MyApp;
