import { Column, useSortBy, useTable } from "react-table";


function BuildPathTable({
  columns,
  data,
  loading,
}: {
  columns: Column<object>[];
  data:
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          // @ts-ignore
          sortBy: [
            {
              id: "winRate",
              desc: true,
            },
          ],
          hiddenColumns: ["item", "slot2", "slot3"],
        },
      },
      useSortBy
    );
  return (<div></div>
  );
}
// function BuildPathTable({
//   columns,
//   data,
//   loading,
// }: {
//   columns: Column<object>[];
//   data:
// }) {
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable(
//       {
//         columns,
//         data,
//         initialState: {
//           // @ts-ignore
//           sortBy: [
//             {
//               id: "winRate",
//               desc: true,
//             },
//           ],
//           hiddenColumns: ["item", "slot2", "slot3"],
//         },
//       },
//       useSortBy
//     );
//   return (
//     <table
//       {...getTableProps()}
//       className={`flex h-full w-full flex-col justify-center text-white ${
//         loading ? "items-center" : ""
//       }`}
//     >
//       <thead className="min-w-full">
//         {headerGroups.map((headerGroup) => (
//           <tr
//             {...headerGroup.getHeaderGroupProps()}
//             className="pointer-cursor block w-full"
//           >
//             <div className="card-header text-md flex lg:text-sm">
//               {headerGroup.headers.map((column) => (
//                 // @ts-ignore
//                 <th
//                   {...column.getHeaderProps(column.getSortByToggleProps())}
//                   className="flex flex-1 flex-row border-winnerColor font-normal"
//                 >
//                   {column.render("Header")}
//                   <span>
//                     {column.isSorted
//                       ? column.isSortedDesc
//                         ? " 🔽"
//                         : " 🔼"
//                       : ""}
//                   </span>
//                 </th>
//               ))}
//             </div>
//           </tr>
//         ))}
//       </thead>
//       {loading ? (
//         <Loading width={24} height={24} />
//       ) : (
//         <tbody className="flex-1" {...getTableBodyProps()}>
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               // <div>{row.values.slot1.itemIcon}</div>
//               <div className="row.valuess-center my-1 flex items-center gap-4 rounded-md bg-card50 p-2">
//                 <div
//                   id="item-image-container"
//                   className="flex min-w-fit flex-1 gap-2"
//                 >
//                   <Image
//                     src={row.values.slot1.DeviceName}
//                     alt={row.values.slot1.DeviceName}
//                     loader={ItemIconLoader}
//                     width={36}
//                     height={36}
//                     className="rounded-md border-4 border-purple-800"
//                   />
//                   <Image
//                     src={row.values.slot2.DeviceName}
//                     alt={row.values.slot2.DeviceName}
//                     loader={ItemIconLoader}
//                     width={36}
//                     height={36}
//                     className="rounded-md border-4 border-purple-800"
//                   />
//                   <Image
//                     src={row.values.slot3.DeviceName}
//                     alt={row.values.slot3.DeviceName}
//                     loader={ItemIconLoader}
//                     width={36}
//                     height={36}
//                     className="rounded-md border-4 border-purple-800"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <span style={{ fontSize: "11px", fontWeight: "700" }}>
//                     {row.values.games} Matches
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <span
//                     style={{
//                       fontSize: "11px",
//                       fontWeight: "700",
//                       color: getWinRateColor(row.values.winRate.toFixed(2)),
//                     }}
//                   >
//                     {row.values.winRate.toFixed(2)}% Win Rate
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <span style={{ fontSize: "11px", fontWeight: "700" }}>
//                     {row.values.pickRate}% Pick Rate
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </tbody>
//       )}
//     </table>
//   );
// }

export default BuildPathTable;
