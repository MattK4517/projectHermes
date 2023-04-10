import { dehydrate, QueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React from "react";
import { TierListLayout } from ".";
import { getWinRateColor } from "../../components/gods/GodHelpers";
import GodIconLoader, {
  RoleIconLoader,
  TierListDefaultFilterLoader,
} from "../../components/loader";
import TierListTable from "../../components/tierlist/TierListTable";
import { ILastUpdate } from "../../models/tierlist/tierlist.model";
import {
  getLastUpdate,
  getTierListData,
} from "../../service/gods/tierlist.service";
import { getBaseUrl } from "../../utils/trpc";
import { GodPagePropsType } from "../gods/[god]/build/[role]";

function DuoTierList(props: {
  dehydratedState: {
    defaultParams: GodPagePropsType;
    lastUpdate: ILastUpdate;
    tierListData: any;
  };
}) {
  console.log(props.dehydratedState.tierListData);
  const columnHelper = createColumnHelper();
  const MEDIUM_COLUMN_SIZE = 100;

  const [roleOne, roleTwo] =
    props.dehydratedState.defaultParams.role.split("-");

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
      columnHelper.accessor(`_id.${roleOne.toLowerCase()}`, {
        header: `${roleOne}`,
        size: 200,
        cell: (info) => (
          <div className="m-1 flex w-full items-center justify-center lg:justify-start">
            <Image
              src={info.cell.getValue()}
              loader={GodIconLoader}
              width={36}
              height={36}
              className={`rounded-sm`}
              alt={`${info.cell.getValue()} icon`}
            />
            <span
              className="ml-4 hidden w-fit text-sm text-white lg:block"
              style={{ whiteSpace: "initial" }}
            >
              {info.cell.getValue()}
            </span>
          </div>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor(`${roleOne?.toLowerCase()}WinRate`, {
        header: `${roleOne} WR`,
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => (
          <span
            style={{ color: getWinRateColor(info.cell.getValue("winRate")) }}
          >{`${info.renderValue().toFixed(2)}%`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor(`_id.${roleTwo.toLowerCase()}`, {
        header: `${roleTwo}`,
        size: 200,
        cell: (info) => (
          <div className="m-1 flex w-full items-center justify-center lg:justify-start">
            <Image
              src={info.cell.getValue()}
              loader={GodIconLoader}
              width={36}
              height={36}
              className={`rounded-sm`}
              alt={`${info.cell.getValue()} icon`}
            />
            <span
              className="ml-4 hidden w-fit text-sm text-white lg:block"
              style={{ whiteSpace: "initial" }}
            >
              {info.cell.getValue()}
            </span>
          </div>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor(`${roleTwo?.toLowerCase()}WinRate`, {
        header: `${roleTwo} WR`,
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => (
          <span
            style={{ color: getWinRateColor(info.cell.getValue("winRate")) }}
          >{`${info.renderValue().toFixed(2)}%`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor(`winRate`, {
        header: `Win Rate`,
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => (
          <span
            style={{ color: getWinRateColor(info.cell.getValue("winRate")) }}
          >{`${info.renderValue().toFixed(2)}%`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("syneryFactor", {
        header: "Synergy",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => <span>{`${info.renderValue().toFixed(2)}%`}</span>,
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
  return (
    <TierListLayout
      defaultParams={props.dehydratedState.defaultParams}
      lastUpdate={props.dehydratedState.lastUpdate.queries[0].state.data}
    >
      <div className="text-white">
        <TierListTable
          defaultParams={props.dehydratedState.defaultParams}
          columns={columns}
          tableData={Object.values(props.dehydratedState.tierListData)}
          type={"Combat"}
          defaultSort={[{ desc: true, id: "winRate" }]}
        />
      </div>
    </TierListLayout>
  );
}

export default DuoTierList;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = {
    lastUpdate: new QueryClient(),
    tierListData: new QueryClient(),
  };
  const url = getBaseUrl();
  const defaultParams: GodPagePropsType = await TierListDefaultFilterLoader({
    url: url,
    type: "Duo",
  });

  await queryClient.lastUpdate.prefetchQuery<ILastUpdate>({
    queryKey: ["last-update"],
    queryFn: () => getLastUpdate(defaultParams.patch),
  });

  await queryClient.tierListData.prefetchQuery({
    queryKey: ["duo-tier-list", defaultParams],
    queryFn: () => getTierListData({ ...defaultParams, type: "Duos", page: 0 }),
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
              "duo-tier-list",
              defaultParams,
            ]).data
          )
        ),
        defaultParams,
      },
    },
  };
};
