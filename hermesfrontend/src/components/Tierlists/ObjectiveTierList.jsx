import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Link } from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { FilterForm } from "../Filters/FilterForm";
import winRateColor from "../mainGodPage/WinRateColor";

const Table = ({ columns, data }) => {
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
                id: 'winRate',
                desc: true
            }
        ]
    }
    },
    useSortBy,
    usePagination
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;
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
                              if (key.includes("rank")) {
                                return (
                                  <>
                                  <div
                                    className="rt-td rank"
                                    style={{
                                      minWidth: "40px",
                                      maxWidth: "60px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>{(i += 1)}</span>
                                  </div>

                                    <div
                                    className="rt-td role"
                                    style={{
                                      minWidth: "40px",
                                      maxWidth: "60px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>{row.original.role}</span>
                                  </div>

                                  <div
                                    className="rt-td god"
                                    style={{ minWidth: "180px", maxWidth: "220px", flex: "1 1 100%" }}
                                    {...cell.getCellProps()}
                                  >
                                    <Link
                                      className="god-played gtm-tierlist-god"
                                      to={"/".concat(routegod)}
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

                                  <div
                                    className="rt-td win-rate"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b style={{color: winRateColor(row.original.winRate)}}>{row.original.winRate}%</b>
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td gold"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {row.original.gold.toFixed()}
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td killsBot"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {row.original.killsBot.toFixed(1)}
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td damageBot"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {row.original.damageBot.toFixed()}
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td towerKills"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {row.original.towerKills.toFixed()}
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td phoenixKills"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {row.original.phoenixKills.toFixed()}
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td wardsPlaced"
                                    style={{
                                      minWidth: "70px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {row.original.wardsPlaced.toFixed()}
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td games"
                                    style={{
                                      minWidth: "80px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.games}</b>
                                    </span>
                                  </div>
                                  </>
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

function ObjectiveTierList(tableType) {
  const [totalData, setTotalData] = useState([]);
  const [counterMatchups, setCounterMatchups] = useState([]);
  const [roles, setRoles] = useState([
    "Solo",
    "Jungle",
    "Mid",
    "Support",
    "Carry",
    "All Roles",
  ]);
  const [role, setRole] = useState("All Roles");
  const [ranks, setranks] = useState([
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Masters",
    "Grandmaster",
    "All_Ranks",
  ]);
  const [dispRank, setRank] = useState("All_Ranks");

  useEffect(() => {
    //"/gettierlist/".concat(dispRank, "/", role, "/", tableType.tableType, "/", patch
    fetch(
      "/gettierlist/".concat(dispRank, "/", role, "/", tableType.tableType)
    ).then((res) =>
      res.json().then((data) => {
        setTotalData([]);
        Object.keys(data).forEach((key) => {
          Object.keys(data[key]).forEach((godData) => {
            setTotalData((totalData) => [
              ...totalData,
              {
                god: data[key][godData].god,
                role: data[key][godData].role,
                winRate: data[key][godData].winRate,
                gold: data[key][godData].gold,
                killsBot: data[key][godData].kills_bot,
                damageBot: data[key][godData].damage_bot,
                towerKills: data[key][godData].tower_kills,
                phoenixKills: data[key][godData].phoenix_kills,
                wardsPlaced: data[key][godData].wards_placed,
                games: data[key][godData].games,
              },
            ]);
          });
        });
      })
    );
  }, [dispRank, role]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "God",
        accessor: "god",
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
      },
      {
        Header: "Gold",
        accessor: "gold",
      },
      {
        Header: "Minion Kills",
        accessor: "killsBot",
      },
      {
        Header: "Minion Damage",
        accessor: "damageBot",
      },
      {
        Header: "Tower Kills",
        accessor: "towerKills",
      },
      {
        Header: "Phoenix Kills",
        accessor: "phoenixKills",
      },
      {
        Header: "Wards Placed",
        accessor: "wardsPlaced",
      },
      {
        Header: "Games",
        accessor: "games",
      },
    ],
    []
  );
  return (
    <>
        <div className="filter-form">
          <FilterForm filter={role} filters={roles} role={role}  setFilter={setRole}/>
          <FilterForm filter={dispRank.replaceAll("_", " ")} filters={ranks} role={dispRank.replaceAll("_", " ")} setFilter={setRank}/>
        </div>
      <Table columns={columns} data={totalData} />
    </>
  );
}

export default ObjectiveTierList;
