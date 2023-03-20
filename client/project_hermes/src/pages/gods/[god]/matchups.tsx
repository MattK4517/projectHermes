import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GodPageLayout } from ".";
import Filter from "../../../components/general/Filter";
import { GodContext } from "../../../components/gods/GodContext";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";
import GodMatchupTable from "../../../components/gods/matchups/MatchupsTable";

function MatchupsPage(props: {
  dehydratedState: {
    godMatchups: {
      queries: any[];
    };
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  let { god, setGod, filterList, setFilterList } = useContext(GodContext);
  const { data, isLoading } = useQuery(
    ["god-matchup-stats", props.dehydratedState.defaultParams],
    () =>
      getGodPageData({
        ...props.dehydratedState.defaultParams,
        type: "matchup-stats",
      })
  );
  if (router.query?.god) setGod(router.query.god);
  const columns = useMemo(
    () => [
      {
        Header: "Enemy",
        accessor: "_id",
      },
      // {
      //   Header: "Win Rate",
      //   accessor: "games.winRate",
      // },
      {
        Header: "Avg Dmg Diff",
        accessor: "avgDmgDiff",
      },
      {
        Header: "Avg Gold Diff",
        accessor: "avgGoldDiff",
      },
      {
        Header: "Avg Kill Diff",
        accessor: "avgKillDiff",
      },
      {
        Header: "Games",
        accessor: "games.games",
      },
      {
        Header: "Pick Rate",
        accessor: "games.pickRate",
      },
      {
        Header: "Win Rate",
        accessor: "games.winRate",
      },
      // {
      //   Header: "Games",
      //   columns: [
      //   ],
      // },
    ],
    []
  );
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <Filter
        filterList={filterList}
        setFilterList={setFilterList}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <GodMatchupTable
        columns={columns}
        data={props.dehydratedState.godMatchups.queries[0].state.data}
      />
    </GodPageLayout>
  );
}

export default MatchupsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godMatchups: new QueryClient(),
  };

  const { god } = context.params;

  let url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godMatchups.prefetchQuery<any>(
    ["god-matchup-stats", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "matchup-stats" })
  );

  return {
    props: {
      dehydratedState: {
        godMatchups: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godMatchups))
        ),
        defaultParams,
      },
    },
  };
};
