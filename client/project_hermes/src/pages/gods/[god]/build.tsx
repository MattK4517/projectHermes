import { dehydrate, QueryClient, useQueries } from "@tanstack/react-query";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useContext } from "react";
import { GodPageLayout } from ".";
import Filter from "../../../components/general/Filter";
import { BuildRow } from "../../../components/gods/build/BuildRow";
import WinRateStats from "../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../components/gods/GodContext";
import MatchupRow from "../../../components/gods/matchups/MatchupRow";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { god, GodWinRateType } from "../../../models/gods.model";
import { Build } from "../../../models/items.model";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";

export type GodPagePropsType = {
  god: god;
  role: string;
  rank: string;
  patch: string;
  queueType: string;
  mode: string;
  type?: string;
};

function BuildPage(props: {
  dehydratedState: {
    godMatchups: any;
    godBuild: any;
    godWinRate: any;
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  let { god, setGod, filterList, setFilterList } = useContext(GodContext);
  if (router.query?.god) setGod(router.query.god);
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <Filter
        filterList={filterList}
        setFilterList={setFilterList}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <WinRateStats
        winRateStats={{
          ...props.dehydratedState.godWinRate.queries[0].state.data,
          queueType: "Ranked",
        }}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <MatchupRow
        matchups={{
          ...props.dehydratedState.godMatchups.queries[0].state.data,
        }}
        god={god}
        role={props.dehydratedState.defaultParams.role}
        displayType="countered"
        defaultParams={props.dehydratedState.defaultParams}
      />

      <MatchupRow
        matchups={{
          ...props.dehydratedState.godMatchups.queries[0].state.data,
        }}
        god={god}
        role={props.dehydratedState.defaultParams.role}
        displayType="counters"
        defaultParams={props.dehydratedState.defaultParams}
      />
      <BuildRow
        build={props.dehydratedState.godBuild.queries[0].state.data}
        defaultParams={props.dehydratedState.defaultParams}
        items={props.dehydratedState.godBuild.queries[0].state.data.items}
        relics={props.dehydratedState.godBuild.queries[0].state.data.relics}
      />
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

  const { god } = context.params;

  let url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godWinRate.prefetchQuery<GodWinRateType>(
    ["god-winrate", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "main" })
  );
  await queryClient.godMatchups.prefetchQuery(
    ["god-matchups", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "matchups" })
  );
  await queryClient.godBuild.prefetchQuery<Build>(
    ["god-build", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "build" })
  );

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
        defaultParams,
      },
    },
  };
};
