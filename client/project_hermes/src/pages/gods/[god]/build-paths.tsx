import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { GodPageLayout } from ".";
import { getDefaultParams } from "../../../components/general/getDefaultParams";
import { GodContext } from "../../../components/gods/GodContext";
import { getWinRateColor } from "../../../components/gods/GodHelpers";
import {
  GodDefaultFilterLoader,
  ItemIconLoader,
} from "../../../components/loader";
import TierListTable from "../../../components/tierlist/TierListTable";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";

function BuildPathsPage(props: {
  dehydratedState: {
    godBuildPaths: {
      queries: any[];
    };
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  const columnHelper = createColumnHelper();
  const MEDIUM_COLUMN_SIZE = 80;
  let { setGod, filterList } = useContext(GodContext);
  console.log(
    JSON.stringify(
      Object.values(props.dehydratedState.defaultParams).sort()
    ) !==
      JSON.stringify(
        Object.values(
          getDefaultParams(filterList, props.dehydratedState.defaultParams.god)
        ).sort()
      )
  );
  const { data, isFetching } = useQuery(
    [
      "god-build-paths",
      getDefaultParams(filterList, props.dehydratedState.defaultParams.god),
    ],
    () =>
      getGodPageData({
        ...getDefaultParams(
          filterList,
          props.dehydratedState.defaultParams.god
        ),
        type: "build-paths",
      }),
    {
      // enable query if new filterlist is different from default Params
      // goal is to not query on mount but after filter changes
      enabled:
        JSON.stringify(
          Object.values(props.dehydratedState.defaultParams).sort()
        ) !==
        JSON.stringify(
          Object.values(
            getDefaultParams(
              filterList,
              props.dehydratedState.defaultParams.god
            )
          ).sort()
        ),
    }
  );
  if (router.query?.god) setGod(router.query.god);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("slot1", {
        header: "Items",
        size: 200,
        cell: (info) => {
          return (
            <div
              id="item-image-container"
              className="flex w-full flex-1 justify-center gap-2"
            >
              <Image
                src={info.row.original.slot1.DeviceName}
                alt={info.row.original.slot1.DeviceName}
                loader={ItemIconLoader}
                width={36}
                height={36}
                className="rounded-md border-2 border-slate-500"
              />
              <Image
                src={info.row.original.slot2.DeviceName}
                alt={info.row.original.slot2.DeviceName}
                loader={ItemIconLoader}
                width={36}
                height={36}
                className="rounded-md border-2 border-slate-500"
              />
              <Image
                src={info.row.original.slot3.DeviceName}
                alt={info.row.original.slot3.DeviceName}
                loader={ItemIconLoader}
                width={36}
                height={36}
                className="rounded-md border-2 border-slate-500"
              />
            </div>
          );
        },
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("winRate", {
        header: "Win Rate",
        size: MEDIUM_COLUMN_SIZE + 10,
        cell: (info) => (
          <span
            style={{ color: getWinRateColor(info.cell.getValue("winRate")) }}
          >{`${info.renderValue()?.toFixed(0)}%`}</span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("pickRate", {
        header: "Pick Rate",
        size: 80,
        cell: (info) => <span>{`${info.renderValue()?.toFixed(2)}%`}</span>,
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
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <div className="flex justify-center">
        <TierListTable
          tableData={Object.values(
            data || props.dehydratedState.godBuildPaths.queries[0].state.data
          )}
          columns={columns}
          // defaultParams={}
          defaultSort={[{ desc: true, id: "pickRate" }]}
          loading={isFetching}
        />
      </div>
    </GodPageLayout>
  );
}

export default BuildPathsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godBuildPaths: new QueryClient(),
  };

  const { god } = context.params;

  let url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godBuildPaths.prefetchQuery<any>(
    ["god-build-paths", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "build-paths" })
  );

  return {
    props: {
      dehydratedState: {
        godBuildPaths: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godBuildPaths))
        ),
        defaultParams,
      },
    },
  };
};
