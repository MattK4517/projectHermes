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
import BuildPathTable from "../../../components/gods/build-paths/BuildPathTable";

function BuildPathsPage(props: {
  dehydratedState: {
    godBuildPaths: {
      queries: any[];
    };
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  let { god, setGod, filterList, setFilterList } = useContext(GodContext);
  const { data, isLoading } = useQuery(
    ["god-build-paths", props.dehydratedState.defaultParams],
    () =>
      getGodPageData({
        ...props.dehydratedState.defaultParams,
        type: "build-paths",
      })
  );
  if (router.query?.god) setGod(router.query.god);
  const columns = useMemo(
    () => [
      {
        Header: "Items",
        accessor: "slot1",
        disableSortBy: true,
      },
      {
        Header: "Games",
        accessor: "games",
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
      },
      {
        Header: "Pick Rate",
        accessor: "pickRate",
      },
      {
        Header: "Slot2",
        accessor: "slot2",
      },
      {
        Header: "Slot3",
        accessor: "slot3",
      },
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
      <BuildPathTable
        data={Object.values(
          data || props.dehydratedState.godBuildPaths.queries[0].state.data
        )}
        columns={columns}
        loading={isLoading}
      />
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
