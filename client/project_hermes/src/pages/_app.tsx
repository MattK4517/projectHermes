// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import SideNav from "../components/general/SideNav";
import AppBar from "../components/general/AppBar";
import Card from "../components/general/Card";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      })
  );

  const [open, setOpen] = React.useState<boolean>(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed z-10 box-border flex flex-col">
        <AppBar open={open} setOpen={setOpen}></AppBar>
      </div>
      <Hydrate state={pageProps.dehydratedState}>
        <main className="fixed top-16 flex h-full w-full ">
          <SideNav open={open} setOpen={setOpen}></SideNav>
          <div className="text-fontAltl flex h-full w-full overflow-scroll bg-mainBackGroundColor p-4">
            <div className="container mx-auto my-4 p-4">
              <Component {...pageProps} />
            </div>
          </div>
        </main>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(MyApp);
