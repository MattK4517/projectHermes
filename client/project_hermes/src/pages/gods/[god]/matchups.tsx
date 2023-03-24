import { QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { GodPageLayout } from ".";
import { GodContext } from "../../../components/gods/GodContext";
import GodMatchupTable from "../../../components/gods/matchups/MatchupsTable";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { IDetailMatchupsReturnType } from "../../../models/gods/gods.model";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";

function MatchupsPage(props: {
  dehydratedState: {
    godMatchups: IDetailMatchupsReturnType;
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  const { setGod } = useContext(GodContext);
  const { data, isLoading } = useQuery<IDetailMatchupsReturnType>(
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
    ],
    []
  );
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <GodMatchupTable
        columns={columns}
        data={data?.entries || props.dehydratedState.godMatchups}
        loading={isLoading}
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

  const url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godMatchups.prefetchQuery<IDetailMatchupsReturnType>(
    ["god-matchup-stats", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "matchup-stats" })
  );

  return {
    props: {
      dehydratedState: {
        godMatchups: JSON.parse(
          JSON.stringify(
            queryClient.godMatchups.getQueryState([
              "god-matchup-stats",
              defaultParams,
            ]).data
          )
        ),
        defaultParams,
      },
    },
  };
};
