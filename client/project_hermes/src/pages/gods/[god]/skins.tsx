import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { GodPageLayout } from ".";
import Filter from "../../../components/general/Filter";
import { GodContext } from "../../../components/gods/GodContext";
import SkinsTable from "../../../components/gods/skins/SkinsTable";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";

function SkinsPage(props: {
  dehydratedState: {
    godSkinStats: {
      queries: any[];
    };
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  let { setGod } = useContext(GodContext);
  const { data, isLoading } = useQuery(
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
        data={
          data?.skins ||
          props.dehydratedState.godSkinStats.queries[0].state.data.skins
        }
        totalGames={Object.values(
          data?.skins ||
            props.dehydratedState.godSkinStats.queries[0].state.data.skins
        ).reduce(function (a: any, b: any) {
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

  let url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godSkinStats.prefetchQuery<any>(
    ["god-skins", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "skin-stats" })
  );

  return {
    props: {
      dehydratedState: {
        godSkinStats: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godSkinStats))
        ),
        defaultParams,
      },
    },
  };
};
