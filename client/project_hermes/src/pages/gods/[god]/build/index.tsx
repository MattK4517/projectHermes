import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout, linkDict } from "..";
import { getDefaultParams } from "../../../../components/general/getDefaultParams";
import { BuildRow } from "../../../../components/gods/build/BuildRow";
import WinRateStats from "../../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../../components/gods/GodContext";
import {
  handleQueryEnabled,
  normalizeGodName,
} from "../../../../components/gods/GodHelpers";
import MatchupRow from "../../../../components/gods/matchups/MatchupRow";
import { GodDefaultFilterLoader } from "../../../../components/loader";
import { god, GodWinRateType } from "../../../../models/gods/gods.model";
import { Build } from "../../../../models/items.model";
import { getGodPageData } from "../../../../service/gods/gods.service";
import { getBaseUrl } from "../../../../utils/trpc";
import { getGods } from "../..";

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
  const { god, setGod, filterList } = useContext(GodContext);

  const { data, isFetching } = useQuery(
    ["god-matchups", getDefaultParams(filterList, god)],
    () =>
      getGodPageData({
        ...getDefaultParams(filterList, god),
        type: "matchups",
      }),
    {
      // enable query if new filterlist is different from default Params
      // goal is to not query on mount but after filter changes
      enabled: handleQueryEnabled(
        props.dehydratedState.defaultParams,
        filterList
      ),
    }
  );

  // @ts-expect-error cant type parsedurlquery
  if (router.query?.god) setGod(router.query.god);

  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <WinRateStats
        winRateStats={{
          ...props.dehydratedState.godWinRate.queries[0].state.data,
          queueType: "Ranked",
        }}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <MatchupRow
        matchups={{
          ...(data || props.dehydratedState.godMatchups.queries[0].state.data),
        }}
        god={props.dehydratedState.defaultParams.god}
        role={
          filterList[filterList.findIndex((val) => val.filterValue === "role")]
            ?.defaultValue || ""
        }
        displayType="countered"
        isFetching={isFetching}
      />

      <MatchupRow
        matchups={{
          ...(data || props.dehydratedState.godMatchups.queries[0].state.data),
        }}
        god={props.dehydratedState.defaultParams.god}
        role={
          filterList[filterList.findIndex((val) => val.filterValue === "role")]
            ?.defaultValue || ""
        }
        displayType="counters"
        isFetching={isFetching}
      />
      <BuildRow
        build={props.dehydratedState.godBuild.queries[0]?.state.data}
        defaultParams={props.dehydratedState.defaultParams}
      />
    </GodPageLayout>
  );
}

export default BuildPage;

export const getStaticPaths = async () => {
  const gods = await getGods();
  return {
    paths: Object.keys(gods).map((god) => {
      return {
        params: {
          god: normalizeGodName(god),
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = {
    godWinRate: new QueryClient(),
    godMatchups: new QueryClient(),
    godBuild: new QueryClient(),
  };

  // @ts-expect-error cant type parsedurlquery
  const { god } = context.params;

  const url = getBaseUrl();
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
    revalidate: 3600,
  };
};
