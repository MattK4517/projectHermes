import { dehydrate, QueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useContext, useMemo } from "react";
import { TierListLayout } from ".";
import Filter from "../../components/general/Filter";
import { TierListDefaultFilterLoader } from "../../components/loader";
import CounterMatchupDisplay from "../../components/tierlist/CounterMatchupDisplay";
import { TierListContext } from "../../components/tierlist/TierListContext";
import TierListTable from "../../components/tierlist/TierListTable";
import { ILastUpdate } from "../../models/tierlist/tierlist.model";
import {
  getLastUpdate,
  getTierListData,
} from "../../service/gods/tierlist.service";
import { getBaseUrl } from "../../utils/trpc";
import { GodPagePropsType } from "../gods/[god]/build";

function TierList(props: {
  dehydratedState: {
    defaultParams: GodPagePropsType;
    lastUpdate: ILastUpdate;
    tierListData: any;
  };
}) {
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "God",
        accessor: "god",
      },
      {
        Header: "Tier",
        accessor: "tier",
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
        Header: "Ban Rate",
        accessor: "banRate",
      },
      {
        Header: "Counter Matchups",
        accessor: "counterMatchups",
        cell: (props) => <CounterMatchupDisplay props={props} />,
      },
      {
        Header: "Games",
        accessor: "games",
      },
    ],
    []
  );
  const { filterList, setFilterList } = useContext(TierListContext);

  return (
    <TierListLayout
      defaultParams={props.dehydratedState.defaultParams}
      lastUpdate={props.dehydratedState.lastUpdate.queries[0].state.data}
    >
      <Filter
        filterList={filterList}
        setFilterList={setFilterList}
        defaultParams={props.dehydratedState.defaultParams}
      />
      <div className="text-white">
        <TierListTable
          columns={columns}
          data={Object.entries(props.dehydratedState.tierListData).map(
            (god) => {
              return Object.values(god[1])[0];
            }
          )}
          loading={false}
        />
        <span>{JSON.stringify(props.dehydratedState.tierListData)}</span>
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
  const defaultParams: GodPagePropsType = await TierListDefaultFilterLoader({
    url: url,
    type: "Regular Tier List",
  });

  await queryClient.lastUpdate.prefetchQuery<ILastUpdate>({
    queryKey: ["last-update"],
    queryFn: () => getLastUpdate(defaultParams.patch),
  });

  await queryClient.tierListData.prefetchQuery({
    queryKey: ["regular-tier-list", defaultParams],
    queryFn: () => getTierListData({ ...defaultParams, type: "Regular" }),
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
