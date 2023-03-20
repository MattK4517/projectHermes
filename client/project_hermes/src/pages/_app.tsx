// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { ReactElement, ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import SideNav from "../components/general/SideNav";
import AppBar from "../components/general/AppBar";
import { GodPageLayout } from "./gods/[god]";
import { NextPage } from "next";
import { GodProvider } from "../components/gods/GodContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
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

  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <QueryClientProvider client={queryClient}>
      <GodProvider>
        <div className="absolute z-10 box-border flex flex-col">
          <AppBar open={open} setOpen={setOpen}></AppBar>
        </div>
        <Hydrate state={pageProps.dehydratedState}>
          <main className="fixed top-16 flex h-full w-full">
            <SideNav open={open} setOpen={setOpen} />
            <div className="text-fontAltl flex h-full w-full overflow-scroll bg-mainBackGroundColor p-0 py-4 sm:p-4">
              <div className="container mx-auto my-6 h-fit max-w-5xl p-0 py-4 sm:p-4">
                {getLayout(<Component {...pageProps} />)}
              </div>
            </div>
          </main>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </GodProvider>
    </QueryClientProvider>
  );
}

MyApp.getLayout = function getLayout(page) {
  return <GodPageLayout>{page}</GodPageLayout>;
};
export default trpc.withTRPC(MyApp);
