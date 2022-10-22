// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SideNav from '../components/general/SideNav'
import AppBar from '../components/general/AppBar'



const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  }))

  return (
    <div className='flex'>
      <QueryClientProvider client={queryClient}>
        <SideNav></SideNav>
        <div className='w-full'>
        <AppBar></AppBar>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps}/>
          </Hydrate>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  )
}

export default trpc.withTRPC(MyApp);
