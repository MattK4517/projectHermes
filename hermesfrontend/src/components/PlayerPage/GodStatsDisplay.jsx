import React, { useState, useEffect, useMemo, useContext } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { FilterForm } from "../Filters/FilterForm";
import winRateColor from "../mainGodPage/WinRateColor";
import Tooltip from "@material-ui/core/Tooltip";
import { PlayerContext } from "./PlayerContext";
import PlayerHeader from "./PlayerHeader";
import { PlayerFilter } from "../Filters/Filter";

const Table = ({ columns, data, player }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: "matches",
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    usePagination
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;
  console.log("player", player);
  return (
    <>
      <div className="stats-tables__content-container">
        <div className="tier-list-page-container" style={{ width: "100%" }}>
          <div className="tier-list-page">
            <div>
              <div
                class="content-section ReactTable ugg-table-2 tier-list"
                role="table"
                {...getTableProps()}
              >
                <div class="rt-thead -header">
                  {headerGroups.map((headerGroup) => (
                    <div
                      class="rt-tr "
                      role="row"
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props

                        <div
                          class={"rt-th inline-".concat(column.id)}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}

                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div class="rt-tbody" role="rowgroup" {...getTableBodyProps()}>
                  {page.map(
                    (row, i) => {
                      prepareRow(row);
                      // if (row.original.role != this.props.role && this.props.role != "All Roles"){
                      //   console.log(row.original.role, this.props.role)
                      //  }
                      return (
                        <div className="rt-tr-group">
                          <div
                            className="rt-tr"
                            role="row"
                            {...row.getRowProps()}
                          >
                            {row.cells.map((cell) => {
                              const { key, role } = cell.getCellProps();
                              if (key.includes("rank")) {
                                return (
                                  <div
                                    className="rt-td rank"
                                    style={{
                                      minWidth: "60px",
                                      maxWidth: "80px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {(i += 1) + pageSize * pageIndex}
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("god")) {
                                let god = row.original.god
                                  .toLowerCase()
                                  .replaceAll(" ", "-");
                                let routegod = row.original.god.replaceAll(
                                  " ",
                                  "_"
                                );
                                if (row.original.god == "Chang'e") {
                                  routegod = "Chang'e";
                                  god = "change";
                                }
                                return (
                                  <div
                                    className="rt-td god"
                                    style={{
                                      minWidth: "175px",
                                      maxWidth: "180px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <Link
                                      className="god-played gtm-tierlist-god"
                                      to={`/player/${player}/god-stats/${routegod}`}
                                    >
                                      <div style={{ position: "relative" }}>
                                        <div className="god-icon">
                                          <div
                                            style={{
                                              height: "30px",
                                              width: "30px",
                                            }}
                                          >
                                            <img
                                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`}
                                              alt={row.original.god}
                                              style={{
                                                height: "48px",
                                                width: "48px",
                                                transform: "scale(0.625)",
                                                transformOrigin: "0px 0px 0px",
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <strong className="god-name">
                                        {row.original.god}
                                      </strong>
                                    </Link>
                                  </div>
                                );
                              } else if (key.includes("winRate")) {
                                return (
                                  <div
                                    className="rt-td win-rate"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "120px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b
                                        style={{
                                          color: winRateColor(
                                            row.original.winRate
                                          ),
                                        }}
                                      >
                                        {row.original.winRate.toFixed(2)}%
                                      </b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("KDA")) {
                                return (
                                  <div
                                    className="rt-td pick-rate"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "120px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.KDA.toFixed(2)}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("kills")) {
                                return (
                                  <div
                                    className="rt-td pick-rate hide"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "120px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.kills}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("deaths")) {
                                return (
                                  <div
                                    className="rt-td ban-rate hide"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "120px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.deaths}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("avgGold")) {
                                return (
                                  <div
                                    className="rt-td ban-rate hide"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "120px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>
                                        {row.original.avgGold.toLocaleString()}
                                      </b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("matches")) {
                                return (
                                  <div
                                    className="rt-td games"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "120px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.matches}</b>
                                    </span>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      );
                    }
                    // }
                  )}
                </div>
              </div>
              <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {"<<"}
                </button>{" "}
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {">"}
                </button>{" "}
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </button>{" "}
                <span>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </span>
                <span>
                  | Go to page:{" "}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(page);
                    }}
                    style={{ width: "100px" }}
                  />
                </span>{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const compare = (a, b) => {
  return a.winRate - b.winRate;
};

export const getKDA = (kills, deaths, assists) => {
  if (deaths > 0) {
    return (kills + 0.5 * assists) / deaths;
  } else {
    return kills + 0.5 * assists;
  }
};

function GodStatsDisplay() {
  const [
    god,
    setGod,
    player,
    setPlayer,
    queueType,
    setQueueType,
    role,
    setRole,
    topLink,
    setTopLink,
    icon,
    setIcon,
    playerLevel,
    setPlayerLevel,
    tab,
    setTab,
    patch,
    setPatch,
    patches,
    mode,
    setMode,
    queueTypes,
    modes,
    inputType,
    setInputType,
    inputTypes,
  ] = useContext(PlayerContext);
  const roles = ["Solo", "Jungle", "Mid", "Support", "Carry"];
  const [godList, setGodList] = useState([]);
  useEffect(() => {
    fetch(
      "/api/getplayergods/".concat(
        player,
        "/",
        queueType,
        "/",
        mode,
        "/",
        inputType
      )
    ).then((res) =>
      res.json().then((data) => {
        let newData = Object.values(data).sort(compare);
        setGodList([]);
        Object.keys(newData).map((god, index) => {
          if (Object.keys(newData[god]).indexOf("god") !== -1) {
            setGodList((godList) => [
              ...godList,
              {
                ...newData[god],
                KDA: getKDA(
                  newData[god]["kills"],
                  newData[god]["deaths"],
                  newData[god]["assists"]
                ),
                winRate: (newData[god]["wins"] / newData[god]["matches"]) * 100,
                avgGold: (
                  newData[god]["gold"] / newData[god]["matches"]
                ).toFixed(),
              },
            ]);
          }
        });
      })
    );
  }, [player, queueType, mode, inputType]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
      },
      {
        Header: "God",
        accessor: "god",
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
        sortType: compareNumericString,
      },
      {
        Header: "KDA",
        accessor: "KDA",
        sortType: compareNumericString,
      },
      {
        Header: "Kills",
        accessor: "kills",
        sortType: compareNumericString,
      },
      {
        Header: "Deaths",
        accessor: "deaths",
        sortType: compareNumericString,
      },
      {
        Header: "Avg Gold",
        accessor: "avgGold",
        sortType: compareNumericString,
      },
      {
        Header: "Games",
        accessor: "matches",
        sortType: compareNumericString,
      },
    ],
    []
  );
  return (
    <div className="player-profile-page">
      <div
        className="player-profile-container content-side-padding"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="content-side-padding background-image-container">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div class="bg-container">
              <img class="background-image" src={topLink} />
            </div>
            <div class="gradient-container">
              <div class="gradient"></div>
            </div>
          </div>
        </div>
        {/* <NameForm setPlayer={setPlayer} /> */}
        <div className={player ?? "undefined"}>
          <PlayerHeader player={player} level={playerLevel} icon={icon} />
          <PlayerFilter
            patch={patch}
            mode={mode}
            queueType={queueType}
            inputType={inputType}
            patches={patches}
            modes={modes}
            inputTypes={inputTypes}
            queueTypes={queueTypes}
            setPatch={setPatch}
            setMode={setMode}
            setQueueType={setQueueType}
            setInputType={setInputType}
          />
        </div>
        <Table columns={columns} data={godList} player={player} />
      </div>
    </div>
  );
}

function compareNumericString(rowA, rowB, id, desc) {
  let a = Number.parseFloat(rowA.values[id]);
  let b = Number.parseFloat(rowB.values[id]);
  if (Number.isNaN(a)) {
    // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

export default GodStatsDisplay;
