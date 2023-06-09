import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import { getDefaultParams } from "../../../components/general/getDefaultParams";
import Loading from "../../../components/general/Loading";
import { GodContext } from "../../../components/gods/GodContext";
import { handleQueryEnabled } from "../../../components/gods/GodHelpers";
import LargeItemRow from "../../../components/gods/items/LargeItemRow";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build/[role]";

function ItemsPage(props: {
  dehydratedState: {
    godItems: {
      queries: any[];
    };
    defaultParams: GodPagePropsType;
  };
}) {
  const router = useRouter();
  const { setGod, filterList } = useContext(GodContext);

  const { data, isFetching } = useQuery(
    [
      "god-items",
      getDefaultParams(filterList, props.dehydratedState.defaultParams.god),
    ],
    () =>
      getGodPageData({
        ...getDefaultParams(
          filterList,
          props.dehydratedState.defaultParams.god
        ),
        type: "items",
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

  // @ts-expect-error cant type router.query
  if (router.query?.god) setGod(router.query.god);
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <div
        className={`grid max-w-full grid-flow-row grid-cols-1 gap-2 text-white lg:grid-cols-2 ${
          isFetching ? "items-center justify-center" : ""
        }`}
      >
        {isFetching ? (
          <Loading width={24} height={24} />
        ) : (
          Object.entries(
            data || props.dehydratedState.godItems.queries[0].state.data
          ).map((slot, index) => {
            if (!slot[0].includes("slot")) return undefined;
            return (
              <div key={index} className="min-w-fit flex-1 px-1">
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

  // @ts-expect-error cant type router.query
  const { god } = context.params;

  const url = getBaseUrl();
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
