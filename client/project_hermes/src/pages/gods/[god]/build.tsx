import { dehydrate, QueryClient, useQueries } from "@tanstack/react-query";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useContext } from "react";
import { GodPageLayout } from ".";
import { BuildRow } from "../../../components/gods/build/BuildRow";
import WinRateStats from "../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../components/gods/GodContext";
import MatchupRow from "../../../components/gods/matchups/MatchupRow";
import { god, GodWinRateType } from "../../../models/gods.model";
import { Build } from "../../../models/items.model";
import { getBaseUrl } from "../../../utils/trpc";

function BuildPage(props: {
  dehydratedState: {
    godMatchups: any;
    godBuild: any;
    godWinrate: any;
  };
}) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  if (router.query?.god) setGod(router.query.god);

  const buildPageQueries = useQueries({
    queries: [
      {
        queryKey: ["god-winrate", god],
        queryFn: async () =>
          (
            await fetch(
              `/api/main/${god}/Solo/All%20Ranks/9.12/Ranked/Conquest`
            )
          ).json(),
        initialData: props.dehydratedState.godWinrate,
      },
      {
        queryKey: ["god-matchups", god],
        queryFn: async () =>
          (
            await fetch(
              `/api/matchups/${god}/Solo/All%20Ranks/9.12/Ranked/Conquest`
            )
          ).json(),
        initialData: props.dehydratedState.godMatchups.data,
      },
      {
        queryKey: ["god-build", god],
        queryFn: async () =>
          (
            await fetch(
              `/api/build/${god}/Solo/All%20Ranks/9.12/Ranked/Conquest`
            )
          ).json(),
        initialData: props.dehydratedState.godBuild.data,
      },
    ],
  });

  const isLoading = buildPageQueries.some((query) => query.isLoading);
  const isError = buildPageQueries.some((query) => query.error);
  if (isLoading) return <h1>LOADING...</h1>;
  if (isError) return <h1>ERROR...</h1>;
  const data = buildPageQueries.map((query) => query.data);
  console.log(data);
  return (
    <GodPageLayout>
      <WinRateStats winRateStats={{ ...data[0], queueType: "Ranked" }} />
      <MatchupRow
        matchups={{ ...data[1] }}
        god={god}
        role={"Solo"}
        displayType="countered"
      />

      <MatchupRow
        matchups={{ ...data[1] }}
        god={god}
        role={"Solo"}
        displayType="counters"
      />
      <BuildRow items={data[2].items} relics={data[2].relics} />
    </GodPageLayout>
  );
}

export default BuildPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godWinRate: new QueryClient(),
    godMatchups: new QueryClient(),
    godBuild: new QueryClient(),
  };
  const { god } = context;

  await queryClient.godWinRate.prefetchQuery<GodWinRateType>(
    ["god-winrate", god],
    () => getGodWinRate(god)
  );
  await queryClient.godMatchups.prefetchQuery(["god-matchups", god], () =>
    getGodMatchups(god)
  );
  await queryClient.godBuild.prefetchQuery<Build>([
    ["god-build", god],
    () => getGodBuild(god),
  ]);
  return {
    props: {
      dehydratedState: {
        godWinRate: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godWinRate))
        ),
        godMatchups: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godMatchups))
        ),
        godBuild: JSON.parse(JSON.stringify(dehydrate(queryClient.godBuild))),
      },
    },
  };
};

async function getGodWinRate(god: god) {
  let url = getBaseUrl();
  return (
    await fetch(url + `/api/main/${god}/Solo/All%20Ranks/9.12/Ranked/Conquest`)
  ).json();
}

async function getGodMatchups(god: god) {
  let url = getBaseUrl();
  return (
    await fetch(
      url + `/api/matchups/${god}/Solo/All%20Ranks/9.12/Ranked/Conquest`
    )
  ).json();
}

async function getGodBuild(god: god) {
  let url = getBaseUrl();
  return (
    await fetch(url + `/api/build/${god}/Solo/All%20Ranks/9.12/Ranked/Conquest`)
  ).json();
}
