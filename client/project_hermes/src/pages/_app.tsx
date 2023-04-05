import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

import { NextPage } from "next";
import NextProgress from "next-progress";
import AppBar from "../components/general/AppBar";
import { AppStateProvider } from "../components/general/AppStateContext";
import SideNav from "../components/general/SideNav";
import { GodProvider } from "../components/gods/GodContext";
import { TierListProvider } from "../components/tierlist/TierListContext";

// eslint-disable-next-line
export type NextPageWithLayout<P = {}, IP = P> = NextPage<any, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            cacheTime: Infinity,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <AppStateProvider>
      <QueryClientProvider client={queryClient}>
        <GodProvider>
          <TierListProvider>
            <div className="absolute z-10 box-border flex flex-col text-xs sm:text-sm">
              <AppBar />
            </div>
            <Hydrate state={pageProps.dehydratedState}>
              <main className="fixed top-16 flex h-full w-full">
                <SideNav />
                <div
                  className="text-fontAltl flex h-full w-full overflow-scroll bg-mainBackGroundColor p-0 py-4 sm:p-4"
                  id="main-div"
                >
                  <NextProgress
                    delay={200}
                    options={{
                      parent: "#main-div",
                      color: "#3273fa",
                      showSpinner: false,
                    }}
                  />
                  <div className="container mx-auto my-6 h-fit max-w-5xl p-0 py-4 sm:p-4">
                    {getLayout(<Component {...pageProps} />)}
                  </div>
                </div>
              </main>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </TierListProvider>
        </GodProvider>
      </QueryClientProvider>
    </AppStateProvider>
  );
}

export default trpc.withTRPC(MyApp);
