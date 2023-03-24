import { QueryClient, useQuery } from "@tanstack/react-query";
import { constants } from "http2";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { GodPageLayout } from ".";
import { GodContext } from "../../../components/gods/GodContext";
import SkinsTable from "../../../components/gods/skins/SkinsTable";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { ISkinStatsReturnType } from "../../../models/gods/gods.model";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";

function SkinsPage(props: {
  dehydratedState: {
    godSkinStats: ISkinStatsReturnType;
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  const { setGod } = useContext(GodContext);
  const { data, isLoading } = useQuery<ISkinStatsReturnType>(
    ["god-skins", props.dehydratedState.defaultParams],
    () =>
      getGodPageData({
        ...props.dehydratedState.defaultParams,
        type: "skin-stats",
      })
  );
  if (router.query?.god) setGod(router.query.god);
  const columns = useMemo(
    () => [
      {
        Header: "Skin",
        accessor: "skin_name",
      },
      {
        Header: "SkinURL",
        accessor: "godSkin_URL",
      },
      {
        Header: "Obtainability",
        accessor: "obtainability",
      },
      { Header: "Favor", accessor: "price_favor" },
      { Header: "Gems", accessor: "price_gems" },
      { Header: "Win Rate", accessor: "winRate" },
      { Header: "Wins", accessor: "wins" },
      { Header: "Games", accessor: "games" },
    ],
    []
  );
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <SkinsTable
        columns={columns}
        loading={isLoading}
        data={data?.skins || props.dehydratedState.godSkinStats.skins}
        totalGames={Object.values(
          data?.skins || props.dehydratedState.godSkinStats.skins
        ).reduce(function (a, b) {
          return a + b.games;
        }, 0)}
      />
    </GodPageLayout>
  );
}

export default SkinsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godSkinStats: new QueryClient(),
  };

  const { god } = context.params;

  constants url = getBaseUrl();
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
