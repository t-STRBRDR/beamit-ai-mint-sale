/* eslint-disable import/no-extraneous-dependencies */
import EventListeners from "@/components/EventListener/EventListener";
import { persistor, store } from "@/reduxtoolkit/store/store";
import "@/styles/global.scss";
import MuiThemeProvider from "@/themes/MuiThemeProvider";
import createEmotionCache from "@/themes/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

/**
 * Suppresses the useLayoutEffect warning when running in SSR mode.
 * In React 19, useLayoutEffect no longer warns on the server for Pages Router,
 * so this is kept as a no-op for backwards compatibility.
 */
function fixSSRLayout() {
  // React 19 no longer warns for useLayoutEffect on the server
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0
    }
  }
});

export interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
export default function CustomApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache
}: CustomAppProps) {
  fixSSRLayout();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <CacheProvider value={emotionCache}>
            <MuiThemeProvider>
              <CssBaseline />
              <Toaster richColors position="bottom-left" />

              <EventListeners />
              <Component {...pageProps} />
            </MuiThemeProvider>
          </CacheProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

/* Getting the current user from the server and passing it to the client. */
CustomApp.getInitialProps = async (context: AppContext) => {
  // // const client = initializeApollo({ headers: context.ctx.req?.headers });

  // // resetServerContext();
  const appProps = await App.getInitialProps(context);
  // return { user: data?.authenticatedItem, ...appProps };

  return { ...appProps };
};
