import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import IconName from "../../general/IconName";
import { ItemIconLoader } from "../../loader";
import TierListTable from "../../tierlist/TierListTable";
import { getWinRateColor } from "../GodHelpers";

interface ILargeItemRowProps {
  items: any[];
  slot: string;
  totalItemCount?: number;
}

const LargeItemRow = ({ items, slot }: ILargeItemRowProps) => {
  const columnHelper = createColumnHelper<any>();
  const MEDIUM_COLUMN_SIZE = 80;

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("item", {
        header: "Items",
        size: 200,
        cell: (info) => {
          return (
            <IconName
              displayIcon={info.cell.getValue() || ""}
              loader={ItemIconLoader}
              width={36}
              height={36}
              iconStyling={"rounded-md border-2 border-slate-500"}
              displayName={info.cell.getValue()}
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
            style={{ color: getWinRateColor(info.cell.getValue()) }}
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
    [columnHelper]
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
        rowDivStyling={"max-h-80 overflow-y-scroll"}
        defaultSort={[{ id: "games", desc: true }]}
      />
    </div>
  );
};

export default LargeItemRow;
