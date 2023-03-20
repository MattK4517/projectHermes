import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import Filter from "../../../components/general/Filter";
import Loading from "../../../components/general/Loading";
import { GodContext } from "../../../components/gods/GodContext";
import LargeItemRow from "../../../components/gods/items/LargeItemRow";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";

function ItemsPage(props: {
  dehydratedState: {
    godItems: {
      queries: any[];
    };
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  let { god, setGod, filterList, setFilterList, tabs } = useContext(GodContext);

  const { data, isLoading } = useQuery(
    ["god-items", props.dehydratedState.defaultParams],
    () =>
      getGodPageData({ ...props.dehydratedState.defaultParams, type: "items" })
  );
  if (router.query?.god) setGod(router.query.god);
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <Filter
        filterList={filterList}
        setFilterList={setFilterList}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <div
        className={`flex flex-row text-white ${
          isLoading ? "items-center justify-center" : ""
        }`}
      >
        {isLoading ? (
          <Loading width={24} height={24} />
        ) : (
          Object.entries(
            data || props.dehydratedState.godItems.queries[0].state.data
          ).map((slot) => {
            if (!slot[0].includes("slot")) return undefined;
            return (
              <div className="min-w-fit flex-1 px-1">
                <LargeItemRow
                  slot={slot[0]}
                  items={Object.values(slot[1])}
                  totalItemCount={Object.values(slot[1]).reduce(function (
                    a: any,
                    b: any
                  ) {
                    return a + b.games;
                  },
                  0)}
                />
              </div>
            );
          })
        )}
      </div>
    </GodPageLayout>
  );
}

export default ItemsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godItems: new QueryClient(),
  };

  const { god } = context.params;

  let url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
    god,
  });

  await queryClient.godItems.prefetchQuery<any>(
    ["god-items", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "items" })
  );

  return {
    props: {
      dehydratedState: {
        godItems: JSON.parse(JSON.stringify(dehydrate(queryClient.godItems))),
        defaultParams,
      },
    },
  };
};
