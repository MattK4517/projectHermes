import { useSortBy, useTable } from "react-table";

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
          );
        })}
      </tbody>
    </table>
  );
}

export default LargeItemTable;
