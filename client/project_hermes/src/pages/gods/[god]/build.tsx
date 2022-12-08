import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import WinRateStats from "../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../components/gods/GodContext";
import { GodWinRateType } from "../../../models/gods/gods.model";
import { getBaseUrl } from "../../../utils/trpc";

function BuildPage(props: { dehydratedState: { godWinrate: any } }) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  if (router.query?.god) setGod(router.query.god);

  console.log(props.dehydratedState);
  const { isSuccess, data, isLoading, error } = useQuery<GodWinRateType>(
    ["god-build", god],
    () => getGodWinRate(god),
    {
      initialData: props.dehydratedState?.godWinrate,
      refetchOnMount: false,
    }
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;

  console.log("DATA WINRATE", data);

  if (isSuccess)
    return (
      <GodPageLayout>
        <WinRateStats
          winRate={data?.winRate}
          pickRate={data?.pickRate}
          banRate={data?.banRate}
          matches={data?.games}
          queueType={"Ranked"}
        />
      </GodPageLayout>
    );
}

export default BuildPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godWinRate: new QueryClient(),
  };
  const god = context.params?.god as string;

  await queryClient.godWinRate.prefetchQuery(["godBuild", god], () =>
    getGodWinRate(god)
  );
  return {
    props: {
      dehydratedState: {
        godWinRate: dehydrate(queryClient.godWinRate),
      },
    },
  };
};

async function getGodWinRate(god: string) {
  let url = getBaseUrl();
  return await fetch(
    url + `/api/main/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`
  ).then((res) => res.json());
}
