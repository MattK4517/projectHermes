import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { GodPagePropsType } from "../../pages/gods/[god]/build/[role]";
import Loading from "../general/Loading";

export default function TierListTable({
  tableData = {},
  columns,
  defaultParams,
  type,
  rowDivStyling,
  defaultSort,
  loading,
}: {
  tableData: any;
  columns: ColumnDef<any, any>[];
  defaultParams: GodPagePropsType;
  type: string;
  rowDivStyling: string;
  defaultSort: SortingState;
  loading: string;
}) {
  const [data, setData] = useState([...tableData]);

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  const [sorting, setSorting] = React.useState<SortingState>(defaultSort);
  console.log(sorting);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full rounded-md bg-card50 p-4 text-xs text-lightBlue sm:text-sm">
      <div className="pb-4 text-lightBlue">
        <div>
          <div className="nav-border-bottom pb-5">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex justify-center">
                {headerGroup.headers.map((header) => (
                  <div
                    className={`${
                      header.id === "counterMatchups"
                        ? "hidden md:flex"
                        : "flex"
                    } justify-center text-white`}
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex justify-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={rowDivStyling}>
            {loading ? (
              <div className="flex justify-center py-2">
                <Loading width={24} height={24} />
              </div>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <div
                  key={row.id}
                  className={`flex rounded-lg py-2 ${
                    i % 2 !== 0 ? "bg-darkBlue" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      className={`${
                        cell.column.id === "counterMatchups"
                          ? "hidden w-0 md:flex"
                          : "flex"
                      } items-center justify-center`}
                      {...{
                        key: cell.id,
                        style: {
                          width: cell.column.getSize(),
                        },
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          className="rounded border p-1 text-white"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="rounded border p-1 text-white"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="rounded border p-1 text-white"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="rounded border p-1 text-white"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <span className="text-bold text-sm">
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 rounded border bg-darkBlue p-1 text-lightBlue"
          />
        </span>
        <select
          className="rounded-sm bg-card p-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option
              key={pageSize}
              value={pageSize}
              className="bg-darkBlue text-lightBlue"
            >
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
