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
import {
  getGodWinRate,
  getGodMatchups,
  getGodBuild,
} from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";

export type GodPagePropsType = {
  god: god;
  role: string;
  rank: string;
  patch: string;
  queueType: string;
  mode: string;
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
  let { god, setGod, filterList, setFilterList, defaultParams } =
    useContext(GodContext);
  if (router.query?.god) setGod(router.query.god);
  useEffect(() => {
    defaultParams = props.dehydratedState.defaultParams;
    let newData = Object.assign([], filterList);
    const index = newData.findIndex((value) => value.filterValue === "role");
    // @ts-ignore
    newData[index] = {
      ...filterList[index],
      defaultValue: defaultParams.role,
    };
    // @ts-ignore
    setFilterList(newData);
  }, []);
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
  // Object.keys(defaultParams).forEach((key) => {
  //   console.log(defaultParams);
  // });

  await queryClient.godWinRate.prefetchQuery<GodWinRateType>(
    ["god-winrate", defaultParams],
    () => getGodWinRate(defaultParams)
  );
  await queryClient.godMatchups.prefetchQuery(
    ["god-matchups", defaultParams],
    () => getGodMatchups(defaultParams)
  );
  await queryClient.godBuild.prefetchQuery<Build>(
    ["god-build", defaultParams],
    () => getGodBuild(defaultParams)
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
