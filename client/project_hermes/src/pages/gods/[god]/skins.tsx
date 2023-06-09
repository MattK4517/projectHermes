import { QueryClient, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { GodPageLayout } from ".";
import IconName from "../../../components/general/IconName";
import SplitTextHidden, {
  SplitTextShow,
} from "../../../components/general/SplitTextRow";
import { getDefaultParams } from "../../../components/general/getDefaultParams";
import { GodContext } from "../../../components/gods/GodContext";
import {
  getWinRateColor,
  handleQueryEnabled,
} from "../../../components/gods/GodHelpers";
import {
  GodDefaultFilterLoader,
  ImgurLoader,
  SkinIconLoader,
} from "../../../components/loader";
import TierListTable from "../../../components/tierlist/TierListTable";
import { ISkinStatsReturnType } from "../../../models/gods/gods.model";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build/[role]";
import Image from "next/image";

function SkinsPage(props: {
  dehydratedState: {
    godSkinStats: ISkinStatsReturnType;
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  const { setGod, filterList } = useContext(GodContext);

  const columnHelper = createColumnHelper();

  const { data, isFetching } = useQuery(
    [
      "god-skins",
      getDefaultParams(filterList, props.dehydratedState.defaultParams.god),
    ],
    () =>
      getGodPageData({
        ...getDefaultParams(
          filterList,
          props.dehydratedState.defaultParams.god
        ),
        type: "skins-stats",
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
  const totalGames = Object.values(
    data?.skins || props.dehydratedState.godSkinStats.skins
  ).reduce(function (a, b) {
    return a + b.games;
  }, 0);
  const columns = useMemo(
    () => [
      columnHelper.accessor("skin_name", {
        header: "Skin",
        minSize: 400,
        maxSize: 1024,
        cell: (info) => (
          <>
            <IconName
              displayIcon={
                info.row.original.godSkin_URL ||
                `https://webcdn.hirezstudios.com/smite/god-skins/${props.dehydratedState.defaultParams.god
                  .toLowerCase()
                  .replaceAll(" ", "-")
                  .replaceAll("'", "")}_golden.jpg`
              }
              loader={SkinIconLoader}
              width={156}
              height={256}
              displayName={info.cell.renderValue()}
            />
            <div
              className="items-between flex flex-1"
              style={{ minWidth: "60%" }}
            >
              <SplitTextShow
                rowOne={`${info.row.original.winRate.toFixed(2)} % WR`}
                rowOneStyle={{
                  color: getWinRateColor(info.row.original.winRate),
                }}
                rowTwo={`${info.row.original.games} Matches`}
              />
              <SplitTextHidden
                rowOne={`${info.row.original.winRate.toFixed(2)} % WR`}
                rowOneStyle={{
                  color: getWinRateColor(info.row.original.winRate),
                }}
                rowTwo={`${info.row.original.wins} Wins`}
              />
              <SplitTextHidden
                rowOne={`${(
                  (info.row.original.games / totalGames) *
                  100
                ).toFixed(2)}% PR`}
                rowTwo={`${info.row.original.games} Games`}
              />

              <div className="mx-1.5 flex min-w-fit flex-1 flex-col items-center justify-center sm:items-start lg:mx-0">
                <div className="flex flex-row items-center">
                  <Image
                    className="mr-2 h-4 w-4"
                    src={"https://i.imgur.com/PiqXvRC.png"}
                    loader={ImgurLoader}
                    alt="Gem Icon"
                  />
                  <span style={{ fontSize: "11px", fontWeight: "700" }}>
                    {info.row.original.price_gems} Gems
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <Image
                    className="mr-2 h-4 w-4"
                    loader={ImgurLoader}
                    src={"https://i.imgur.com/0ArqEe0.png"}
                    alt="Favor Icon"
                  />
                  <span className="text-lightBlue" style={{ fontSize: "12px" }}>
                    {info.row.original.price_favor} Favor
                  </span>
                </div>
              </div>
              <div className="mx-1.5 flex min-w-fit flex-1 flex-col lg:mx-0">
                <span style={{ fontSize: "11px", fontWeight: "700" }}>
                  {info.row.original.obtainability}
                </span>
              </div>
            </div>
          </>
        ),
        footer: (info) => info.column.id,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <div className="w-fit">
        <TierListTable
          columns={columns}
          tableData={data?.skins || props.dehydratedState.godSkinStats.skins}
          loading={isFetching}
        />
      </div>
      {/* <SkinsTable
        columns={columns}
        loading={isLoading}
        data={data?.skins || props.dehydratedState.godSkinStats.skins}
        totalGames={Object.values(
          data?.skins || props.dehydratedState.godSkinStats.skins
        ).reduce(function (a, b) {
          return a + b.games;
        }, 0)}
      /> */}
    </GodPageLayout>
  );
}

export default SkinsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godSkinStats: new QueryClient(),
  };

  const { god } = context.params;

  const url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godSkinStats.prefetchQuery<ISkinStatsReturnType>(
    ["god-skins", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "skin-stats" })
  );

  return {
    props: {
      dehydratedState: {
        godSkinStats: JSON.parse(
          JSON.stringify(
            queryClient.godSkinStats.getQueryState(["god-skins", defaultParams])
              .data
          )
        ),
        defaultParams,
      },
    },
  };
};
