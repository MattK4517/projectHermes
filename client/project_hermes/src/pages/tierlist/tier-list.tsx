import { dehydrate, QueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useContext } from "react";
import { TierListLayout } from ".";
import Filter from "../../components/general/Filter";
import { getWinRateColor } from "../../components/gods/GodHelpers";
import GodIconLoader, {
  GodDefaultFilterLoader,
  RoleIconLoader,
  TierListDefaultFilterLoader,
} from "../../components/loader";
import CounterMatchupDisplay from "../../components/tierlist/CounterMatchupDisplay";
import { TierListContext } from "../../components/tierlist/TierListContext";
import TierListTable from "../../components/tierlist/TierListTable";
import { ILastUpdate } from "../../models/tierlist/tierlist.model";
import {
  getLastUpdate,
  getTierListData,
} from "../../service/gods/tierlist.service";
import { getApiUrl, getBaseUrl } from "../../utils/trpc";
import { GodPagePropsType } from "../gods/[god]/build";
import FilterListContainer from "../../components/general/FilterList";

export const getTierColor = (tier: string): string => {
  let color = "#414165";
  if (tier === "D") {
    color = "#ff4e50";
  } else if (tier === "C") {
    color = "#fcb1b2";
  } else if (tier === "B") {
    color = "white";
  } else if (tier === "A") {
    color = "#e2ccff";
  } else if (tier === "S") {
    color = "#bf94e4";
  } else if (tier === "S+") {
    color = "#a966ff";
  }
  return color;
};

function TierList(props: {
  dehydratedState: {
    defaultParams: GodPagePropsType;
    lastUpdate: ILastUpdate;
    tierListData: any;
  };
}) {
  const columnHelper = createColumnHelper();
  const MEDIUM_COLUMN_SIZE = 90;

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("rank", {
        header: "Rank",
        cell: (props) => {
          return (
            props?.table?.getSortedRowModel()?.flatRows?.indexOf(props?.row) + 1
          );
        },
        footer: (info) => info.column.id,
        size: 50,
        enableSorting: false,
        enableHiding: true,
      }),
      columnHelper.accessor("role", {
        header: "Role",
        size: MEDIUM_COLUMN_SIZE,
        enableSorting: false,
        cell: (info) => (
          <div className="flex min-w-fit justify-center">
            <Image
              src={info.cell.getValue("role")}
              loader={RoleIconLoader}
              width={36}
              height={36}
              alt={`${info.cell.getValue("role")} icon`}
            />
          </div>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("god", {
        header: "God",
        size: 200,
        cell: (info) => (
          <div className="m-1 flex w-full items-center justify-center lg:justify-start">
            <Image
              src={info.cell.getValue("god")}
              loader={GodIconLoader}
              width={36}
              height={36}
              className={`rounded-sm`}
              alt={`${info.cell.getValue("god")} icon`}
            />
            <span
              className="ml-4 hidden w-fit text-sm text-white lg:block"
              style={{ whiteSpace: "initial" }}
            >
              {info.cell.getValue("god")}
            </span>
          </div>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("tier", {
        header: "Tier",
        size: 50,
        cell: (info) => (
          <span
            style={{ color: getTierColor(info.cell.getValue("tier")) }}
          >{`${info.renderValue()}`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("winRate", {
        header: "Win Rate",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => (
          <span
            style={{ color: getWinRateColor(info.cell.getValue("winRate")) }}
          >{`${info.renderValue()}%`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("pickRate", {
        header: "Pick Rate",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => `${info.renderValue()}%`,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("banRate", {
        header: "Ban Rate",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => `${info.renderValue()}%`,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("counterMatchups", {
        header: "Counter Matchups",
        size: 250,
        enableSorting: false,
        cell: (props) => (
          <CounterMatchupDisplay props={props.row.original.counterMatchups} />
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("games", {
        header: "Games",
        size: 80,
        cell: (info) => info.renderValue()?.toLocaleString(),
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const { filterList, setFilterList } = useContext(TierListContext);

  return (
    <TierListLayout
      defaultParams={{
        ...props.dehydratedState.defaultParams,
        type: "Tier List",
      }}
      lastUpdate={props.dehydratedState.lastUpdate.queries[0].state.data}
    >

      <div className="pt-5 text-white">
        <TierListTable
          defaultParams={props.dehydratedState.defaultParams}
          columns={columns}
          tableData={Object.entries(props.dehydratedState.tierListData)
            .map((god) => {
              return [...Object.values(god[1])];
            })
            .flat()}
          type={"Regular"}
          defaultSort={[{ id: "winRate", desc: true }]}
        />
      </div>
    </TierListLayout>
  );
}

export default TierList;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = {
    lastUpdate: new QueryClient(),
    tierListData: new QueryClient(),
  };
  const url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url: url,
    type: "Regular",
  });

  await queryClient.lastUpdate.prefetchQuery<ILastUpdate>({
    queryKey: ["last-update"],
    queryFn: () => getLastUpdate(defaultParams.patch),
  });

  await queryClient.tierListData.prefetchQuery({
    queryKey: ["regular-tier-list", defaultParams],
    queryFn: () =>
      getTierListData({ ...defaultParams, type: "Regular", page: 0 }),
  });

  return {
    props: {
      dehydratedState: {
        lastUpdate: JSON.parse(
          JSON.stringify(dehydrate(queryClient.lastUpdate))
        ),
        tierListData: JSON.parse(
          JSON.stringify(
            queryClient.tierListData.getQueryState([
              "regular-tier-list",
              defaultParams,
            ]).data
          )
        ),
        defaultParams,
      },
    },
  };
};
