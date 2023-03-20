import { useSortBy, useTable } from "react-table";
import GodIconLoader, { ItemIconLoader } from "../../loader";
import Image from "next/image";
import { getWinRateColor } from "../GodHelpers";
import Loading from "../../general/Loading";
import IconName from "../../general/IconName";

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
              id: "games.winRate",
              desc: true,
            },
          ],
          hiddenColumns: [],
        },
      },
      useSortBy
    );
  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full rounded-md bg-card50 text-white"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.Header?.toString() === "Enemy") {
                    return (
                      <div>
                        <IconName
                          displayIcon={row.values._id}
                          loader={GodIconLoader}
                          width={48}
                          height={48}
                        />
                      </div>
                    );
                  }
                  return (
                    <td {...cell.getCellProps()} className="content-center">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
    // <table
    //   {...getTableProps()}
    //   className={`flex h-full w-full flex-col justify-center text-white ${
    //     loading ? "items-center" : ""
    //   }`}
    // >
    //   <thead className="min-w-full">
    //     {headerGroups.map((headerGroup) => (
    //       <tr
    //         {...headerGroup.getHeaderGroupProps()}
    //         className="pointer-cursor block w-full"
    //       >
    //         <div className="card-header text-md flex lg:text-sm">
    //           {headerGroup.headers.map((column) => (
    //             // @ts-ignore
    //             <th
    //               {...column.getHeaderProps(column.getSortByToggleProps())}
    //               className="flex flex-1 flex-row justify-center border-winnerColor font-normal"
    //             >
    //               {column.render("Header")}
    //               <span>
    //                 {column.isSorted
    //                   ? column.isSortedDesc
    //                     ? " 🔽"
    //                     : " 🔼"
    //                   : ""}
    //               </span>
    //             </th>
    //           ))}
    //         </div>
    //       </tr>
    //     ))}
    //   </thead>
    //   {loading ? (
    //     <Loading width={24} height={24} />
    //   ) : (
    //     <tbody className="flex-1" {...getTableBodyProps()}>
    //       {rows.map((row) => {
    //         prepareRow(row);
    //         console.log(row.values);
    //         return (
    //           <tr {...row.getRowProps()}>
    //             {row.cells.map((cell) => {
    //               return (
    //                 <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
    //               );
    //             })}
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   )}
    // </table>
  );
}

export default GodMatchupTable;

{
  /* <div className="row.valuess-center my-1 flex items-center gap-4 rounded-md bg-card50 p-2">
<div className="max-w-24  min-w-fit flex-1 sm:pr-16">
  <IconName
    displayIcon={row.values._id}
    loader={GodIconLoader}
    width={48}
    height={48}
  />
</div>
<div className="min-w-fit flex-1">
  <span
    style={{
      fontSize: "11px",
      fontWeight: "700",
      color: getWinRateColor(
        row.values.games.winRate.toFixed(2)
      ),
    }}
  >
    {row.values.games.winRate.toFixed(2)}% Win Rate
  </span>
</div>
<div className="flex min-w-fit flex-1 flex-col items-center lg:flex">
  <span
    className=" text-lightBlue"
    style={{ fontSize: "12px" }}
  >
    {row.values.avgDmgDiff.toFixed(2)}
  </span>
</div>
<div className="flex min-w-fit flex-1 flex-col items-center lg:flex">
  <span
    className=" text-lightBlue"
    style={{ fontSize: "12px" }}
  >
    {row.values.avgGoldDiff.toFixed(2)}
  </span>
</div>
<div className="flex min-w-fit flex-1 flex-col items-center lg:flex">
  <span
    className=" text-lightBlue"
    style={{ fontSize: "12px" }}
  >
    {row.values.avgKillDiff.toFixed(2)}
  </span>
</div>
<div className="flex min-w-fit flex-1 flex-col items-center lg:flex">
  <span
    className="hidden font-bold sm:block"
    style={{ fontSize: "12px" }}
  >
    {row.values.games.pickRate.toFixed(2)}% PR
  </span>
  <span
    className=" text-lightBlue"
    style={{ fontSize: "12px" }}
  >
    {row.values.games.games} Games
  </span>
</div>
</div> */
}
