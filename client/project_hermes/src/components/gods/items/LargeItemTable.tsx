import Image from "next/image";
import { useSortBy, useTable } from "react-table";
import { ItemIconLoader } from "../../loader";

function LargeItemTable({ columns, data, totalItemCount, slot }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          // @ts-ignore
          sortBy: [
            {
              id: "games",
              desc: true,
            },
          ],
          hiddenColumns: ["item", "wins"],
        },
      },
      useSortBy
    );

  return (
    <table {...getTableProps()} className="flex h-full w-full flex-col">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="pointer-cursor block w-full"
          >
            <div className="card-header flex text-xs lg:text-sm">
              <span className="flex-1 cursor-pointer">Slot {slot.at(-1)}</span>
              {headerGroup.headers.map((column) => (
                // @ts-ignore
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="flex flex-1 flex-row border-winnerColor font-normal"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </div>
          </tr>
        ))}
      </thead>
      <tbody className="flex-1" {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <div className="row.valuess-center my-1 flex items-center rounded-md bg-card50 p-2">
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
            </div>
          );
        })}
      </tbody>
    </table>
  );
}

export default LargeItemTable;
