import Image from "next/image";
import { useContext } from "react";
import { useSortBy, useTable } from "react-table";
import IconName from "../../general/IconName";
import Loading from "../../general/Loading";
import SplitTextHidden, { SplitTextShow } from "../../general/SplitTextRow";
import { ImgurLoader, SkinIconLoader } from "../../loader";
import { GodContext } from "../GodContext";
import { getWinRateColor } from "../GodHelpers";

function SkinsTable({ columns, data, loading, totalGames }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: "games",
              desc: true,
            },
          ],
          hiddenColumns: [
            "godSkin_URL",
            "obtainability",
            "price_favor",
            "price_gems",
            "wins",
          ],
        },
      },
      useSortBy
    );
  const { god } = useContext(GodContext);
  return (
    <>
      <div
        {...getTableProps()}
        className=" min-w-full rounded-md bg-card50 p-4 text-xs text-lightBlue sm:text-sm"
      >
        <div className="pb-4 text-white">
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="flex items-center justify-center"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  key={column.id}
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
                  key={row.id}
                  {...row.getRowProps()}
                  className={`flex  ${i % 2 !== 0 ? "bg-darkBlue" : ""}`}
                >
                  <div className="flex w-full items-center p-2">
                    <div className="flex w-full flex-1">
                      <IconName
                        displayIcon={
                          row.values.godSkin_URL ||
                          `https://webcdn.hirezstudios.com/smite/god-skins/${god
                            .toLowerCase()
                            .replaceAll(" ", "-")
                            .replaceAll("'", "")}_golden.jpg`
                        }
                        loader={SkinIconLoader}
                        width={156}
                        height={256}
                        displayName={row.values.skin_name}
                      />
                    </div>
                    <div
                      className="items-between flex flex-1"
                      style={{ minWidth: "60%" }}
                    >
                      <SplitTextShow
                        rowOne={`${row.values.winRate.toFixed(2)} % WR`}
                        rowOneStyle={{
                          color: getWinRateColor(row.values.winRate),
                        }}
                        rowTwo={`${row.values.games} Matches`}
                      />
                      <SplitTextHidden
                        rowOne={`${row.values.winRate.toFixed(2)} % WR`}
                        rowOneStyle={{
                          color: getWinRateColor(row.values.winRate),
                        }}
                        rowTwo={`${row.values.wins} Wins`}
                      />
                      <SplitTextHidden
                        rowOne={`${(
                          (row.values.games / totalGames) *
                          100
                        ).toFixed(2)}% PR`}
                        rowTwo={`${row.values.games} Games`}
                      />

                      <div className="mx-1.5 flex min-w-fit flex-1 flex-col items-center justify-center sm:items-start lg:mx-0">
                        <div className="flex flex-row items-center">
                          <Image
                            loader={ImgurLoader}
                            width={16}
                            height={16}
                            className="mr-2 h-4 w-4"
                            src={"https://i.imgur.com/PiqXvRC.png"}
                            alt="Gem icon"
                          />
                          <span style={{ fontSize: "11px", fontWeight: "700" }}>
                            {row.values.price_gems} Gems
                          </span>
                        </div>
                        <div className="flex flex-row items-center">
                          <Image
                            loader={ImgurLoader}
                            width={16}
                            height={16}
                            className="mr-2 h-4 w-4"
                            src={"https://i.imgur.com/0ArqEe0.png"}
                            alt="Favor icon"
                          />
                          <span
                            className="text-lightBlue"
                            style={{ fontSize: "12px" }}
                          >
                            {row.values.price_favor} Favor
                          </span>
                        </div>
                      </div>
                      <div className="mx-1.5 flex min-w-fit flex-1 flex-col lg:mx-0">
                        <span style={{ fontSize: "11px", fontWeight: "700" }}>
                          {row.values.obtainability}
                        </span>
                      </div>
                    </div>
                  </div>
                </tr>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default SkinsTable;
