import { QueryClient, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { GodPageLayout } from ".";
import IconName from "../../../components/general/IconName";
import { getDefaultParams } from "../../../components/general/getDefaultParams";
import { GodContext } from "../../../components/gods/GodContext";
import {
  getWinRateColor,
  handleQueryEnabled,
} from "../../../components/gods/GodHelpers";
import GodIconLoader, {
  GodDefaultFilterLoader,
} from "../../../components/loader";
import TierListTable from "../../../components/tierlist/TierListTable";
import { IDetailMatchupsReturnType } from "../../../models/gods/gods.model";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build/[role]";

function MatchupsPage(props: {
  dehydratedState: {
    godMatchups: IDetailMatchupsReturnType;
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  const { setGod, filterList } = useContext(GodContext);

  const columnHelper = createColumnHelper();
  const MEDIUM_COLUMN_SIZE = 80;

  const { data, isFetching } = useQuery(
    [
      "god-matchup-stats",
      getDefaultParams(filterList, props.dehydratedState.defaultParams.god),
    ],
    () =>
      getGodPageData({
        ...getDefaultParams(
          filterList,
          props.dehydratedState.defaultParams.god
        ),
        type: "matchup-stats",
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
  if (router.query?.god) setGod(router.query.god);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("_id", {
        header: "Enemy",
        size: 400,
        cell: (info) => (
          <IconName
            displayIcon={info.cell.getValue() || ""}
            loader={GodIconLoader}
            width={36}
            height={36}
            styling={"rounded-md border-2 border-yellow-800"}
            displayName={info.cell.getValue()}
          />
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("games.winRate", {
        header: "Win Rate",
        size: MEDIUM_COLUMN_SIZE + 10,
        cell: (info) => (
          <span
            style={{ color: getWinRateColor(info.cell.getValue("winRate")) }}
          >{`${info.renderValue()?.toFixed(0)}%`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("games.pickRate", {
        header: "Pick Rate",
        size: MEDIUM_COLUMN_SIZE + 10,
        cell: (info) => <span>{`${info.renderValue()?.toFixed(2)}%`}</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("avgDmgDiff", {
        header: "Dmg Diff",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => <span>{`${info.renderValue()}`}</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("avgKillDiff", {
        header: "Kill Diff",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => <span>{`${info.renderValue()?.toFixed(2)}`}</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("avgGoldDiff", {
        header: "Gold Diff",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => <span>{`${info.renderValue()}`}</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("games.games", {
        header: "Games",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => info.renderValue()?.toLocaleString(),
        footer: (info) => info.column.id,
        enableSorting: true,
      }),
    ],
    []
  );

  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <div className="flex justify-center">
        <TierListTable
          tableData={
            Object.values(data || props.dehydratedState.godMatchups)[0]
          }
          columns={columns}
          // defaultParams={}
          defaultSort={[{ desc: true, id: "games_games" }]}
          loading={isFetching}
        />
      </div>
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
