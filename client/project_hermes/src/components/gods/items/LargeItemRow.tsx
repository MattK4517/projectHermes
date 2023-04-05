import { createColumnHelper } from "@tanstack/react-table";
import React, { useContext } from "react";
import { GodPagePropsType } from "../../../pages/gods/[god]/build";
import IconName from "../../general/IconName";
import { getDefaultParams } from "../../general/getDefaultParams";
import { ItemIconLoader } from "../../loader";
import TierListTable from "../../tierlist/TierListTable";
import { GodContext } from "../GodContext";
import { getWinRateColor } from "../GodHelpers";

interface ILargeItemRowProps {
  items: any[];
  slot: string;
  totalItemCount: number;
}

const LargeItemRow = ({ items, slot, totalItemCount }: ILargeItemRowProps) => {
  const { filterList, setFilterList } = useContext(GodContext);
  const defaultParams: Partial<GodPagePropsType> = getDefaultParams(filterList);

  const columnHelper = createColumnHelper();
  const MEDIUM_COLUMN_SIZE = 80;

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("item", {
        header: "Items",
        size: 200,
        cell: (info) => {
          return (
            <IconName
              displayIcon={info.cell.getValue("item") || ""}
              loader={ItemIconLoader}
              width={36}
              height={36}
              displayName={"rounded-md border-2 border-slate-500"}
            />
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
      columnHelper.accessor("games", {
        header: "Games",
        size: 80,
        cell: (info) => info.renderValue()?.toLocaleString(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("wins", {
        header: "Wins",
        size: 80,
        cell: (info) => info.renderValue()?.toLocaleString(),
        footer: (info) => info.column.id,
      }),
    ],
    []
  );
  items = items.map((item) => {
    return { ...item, winRate: (item.wins / item.games) * 100 };
  });
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <span className="text-xl font-bold">Slot {slot[4]} Items</span>
      <TierListTable
        tableData={items}
        columns={columns}
        defaultParams={defaultParams}
        type={""}
        rowDivStyling={"max-h-80 overflow-y-scroll"}
        defaultSort={[{ id: "games", desc: true }]}
      />
    </div>
  );
};

export default LargeItemRow;

{
  /* <div className="row.valuess-center my-1 flex items-center rounded-md bg-card50 p-2">
<Image
  src={row.values.item}
  alt={row.values.item}
  loader={ItemIconLoader}
  width={36}
  height={36}
  className="rounded-md border-2 border-slate-500"
/>
<div className="mx-1.5 flex min-w-fit flex-col lg:mx-0 lg:hidden">
  <span style={{ fontSize: "11px", fontWeight: "700" }}>
    {row.values.winRate.toFixed(2)}% WR
  </span>
  <span className="text-lightBlue" style={{ fontSize: "12px" }}>
    {row.values.games} Matches
  </span>
</div>
<div className="mx-1.5 hidden min-w-fit flex-1 flex-col lg:flex">
  <span className=" font-bold" style={{ fontSize: "12px" }}>
    {row.values.winRate.toFixed(2)}% WR
  </span>
  <span className=" text-lightBlue" style={{ fontSize: "12px" }}>
    {row.values.wins} Wins
  </span>
</div>
<div className="hidden min-w-fit flex-1 flex-col lg:flex">
  <span className=" font-bold" style={{ fontSize: "12px" }}>
    {((row.values.games / totalItemCount) * 100).toFixed(2)}% PR
  </span>
  <span className=" text-lightBlue" style={{ fontSize: "12px" }}>
    {row.values.games} Games
  </span>
</div>
</div> */
}
