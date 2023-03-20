import { useMemo } from "react";
import LargeItemTable from "./LargeItemTable";

interface ILargeItemRowProps {
  items: any[];
  slot: string;
  totalItemCount: number;
}

const LargeItemRow = ({ items, slot, totalItemCount }: ILargeItemRowProps) => {
  //   console.log(items);
  const columns = useMemo(
    () => [
      {
        Header: "Wins",
        accessor: "winRate",
      },
      {
        Header: "Games",
        accessor: "games",
      },
      {
        Header: "wins",
        accessor: "wins",
      },
      {
        Header: "items",
        accessor: "item",
      },
    ],
    []
  );
  items = items.map((item) => {
    return { ...item, winRate: (item.wins / item.games) * 100 };
  });
  return (
    <LargeItemTable
      columns={columns}
      data={items}
      totalItemCount={totalItemCount}
      slot={slot}
    />
  );
};

export default LargeItemRow;
