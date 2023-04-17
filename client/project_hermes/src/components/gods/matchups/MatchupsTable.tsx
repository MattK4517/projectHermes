import { useSortBy, useTable } from "react-table";
import GodIconLoader from "../../loader";

import IconName from "../../general/IconName";
import Loading from "../../general/Loading";
import { getWinRateColor } from "../GodHelpers";

function GodMatchupTable({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          // @ts-ignore
          sortBy: [
            {
              id: "games.pickRates",
              desc: true,
            },
          ],
          hiddenColumns: [],
        },
      },
      useSortBy
    );
  return (
    <div>
      <div
        {...getTableProps()}
        className="min-w-full rounded-md bg-card50 p-4 text-xs text-lightBlue sm:text-sm"
      >
        <div className="pb-4 text-white">
          {headerGroups.map((headerGroup) => (
            <tr
              className="flex items-center justify-center"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  className="flex-1"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </div>
        <div
          className="border border-gray-400"
          style={{ borderBottomWidth: "1px" }}
        />
        {loading ? (
          <div className="flex w-full items-center justify-center pt-4">
            <Loading width={24} height={24} />
          </div>
        ) : (
          <div {...getTableBodyProps()} className="pt-4">
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`flex  ${i % 2 !== 0 ? "bg-darkBlue" : ""}`}
                >
                  {row.cells.map((cell) => {
                    if (cell.column.Header?.toString() === "Enemy") {
                      return (
                        <div className="min-w-fit flex-1">
                          <IconName
                            displayIcon={row.values._id}
                            loader={GodIconLoader}
                            width={36}
                            height={36}
                          />
                        </div>
                      );
                    }
                    return (
                      <td
                        style={
                          cell.column.Header?.toString() === "Win Rate"
                            ? { color: getWinRateColor(cell.value) }
                            : {}
                        }
                        {...cell.getCellProps()}
                        className={`flex flex-1 content-center items-center justify-center 
                      `}
                      >
                        {cell.render("Cell")}
                        {["Win Rate", "Pick Rate"].indexOf(
                          cell.column.Header?.toString()
                        ) !== -1
                          ? "%"
                          : ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default GodMatchupTable;
