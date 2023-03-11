import { dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { QueryClient } from "react-query";
import { GodPageLayout } from ".";
import Filter from "../../../components/general/Filter";
import { GodContext } from "../../../components/gods/GodContext";
import LargeItemRow from "../../../components/gods/items/LargeItemRow";
import { GodDefaultFilterLoader } from "../../../components/loader";
import { getGodItems } from "../../../service/gods/gods.service";
import { getBaseUrl } from "../../../utils/trpc";
import { GodPagePropsType } from "./build";

function ItemsPage(props) {
  const router = useRouter();
  let { god, setGod, filterList, setFilterList } = useContext(GodContext);
  console.log("ITEMS PAGE", props.dehydratedState);
  if (router.query?.god) setGod(router.query.god);
  return (
    <GodPageLayout defaultParams={props.dehydratedState.defaultParams}>
      <Filter
        filterList={filterList}
        setFilterList={setFilterList}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <div className="flex flex-row text-white">
        {/* 
        Relic slot 1 display  || Relic slot 2 display
        Item slots display
         */}
        {Object.entries(
          props.dehydratedState.godItems.queries[0].state.data
        ).map((slot) => {
          if (!slot[0].includes("slot")) return undefined;
          return <LargeItemRow items={Object.values(slot[1])} />;
        })}
        {/* {JSON.stringify(
          Object.entries(props.dehydratedState.godItems.queries[0].state.data)
        )} */}
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
    () => getGodItems(defaultParams)
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
