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
                              let god = row.original.carry
                              .toLowerCase()
                              .replaceAll(" ", "-");
                              let routegod = row.original.carry.replaceAll(
                                " ",
                                "_"
                              );
                              if (row.original.carry == "Chang'e") {
                                routegod = "Chang'e";
                                god = "change";
                              }
                              let god2 = row.original.support
                              .toLowerCase()
                              .replaceAll(" ", "-");
                              let routegod2 = row.original.support.replaceAll(
                                " ",
                                "_"
                              );
                              if (row.original.support == "Chang'e") {
                                routegod2 = "Chang'e";
                                god2 = "change";
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
                                    className="rt-td god"
                                    style={{ minWidth: "140px", maxWidth: "180px", flex: "1 1 100%" }}
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
                                              alt={row.original.carry}
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
                                        {row.original.carry}
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
                                      <b style={{color: winRateColor(row.original.carryWinRate)}}>{row.original.carryWinRate.toFixed(2)}%</b>
                                    </span>
                                  </div>


                                  <div
                                    className="rt-td god"
                                    style={{ minWidth: "160px", maxWidth: "180px", flex: "1 1 100%" }}
                                    {...cell.getCellProps()}
                                  >
                                    <Link
                                      className="god-played gtm-tierlist-god"
                                      to={"/".concat(routegod2)}
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
                                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${god2}.jpg`}
                                              alt={row.original.support}
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
                                        {row.original.support}
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
                                      <b style={{color: winRateColor(row.original.supportWinRate)}}>{row.original.supportWinRate.toFixed(2)}%</b>
                                    </span>
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
                                      <b style={{color: winRateColor(row.original.syneryFactor*10)}}>{row.original.syneryFactor.toFixed(2)}%</b>
                                    </span>
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

function DuoLaneTierList(tableType) {
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
      "/api/gettierlist/".concat(dispRank, "/", role, "/", tableType.tableType)
    ).then((res) =>
      res.json().then((data) => {
        setTotalData([]);
        Object.keys(data).forEach((key) => {
          if (data[key]["count"]+data[key]["losses"] > 250) {
            setTotalData((totalData) => [
              ...totalData,
              {
                carry: data[key]["_id"]["carry"],
                support: data[key]["_id"]["support"],
                winRate: data[key]["winRate"],
                games: data[key]["count"]+data[key]["losses"],
                carryWinRate: data[key]["carryWinRate"],
                supportWinRate: data[key]["supportWinRate"],
                syneryFactor: data[key]["syneryFactor"]
              },
            ]);
          }
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
        Header: "Carry",
        accessor: "carry",
      },
      {
        Header: "Carry Win Rate",
        accessor: "carryWinRate",
        sortType: compareNumericString
      },
      {
        Header: "Support",
        accessor: "support",
      },
      {
        Header: "Support Win Rate",
        accessor: "supportWinRate",
        sortType: compareNumericString
      },
      {
        Header: "Synery Factor",
        accessor: "syneryFactor",
        sortType: compareNumericString
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
        sortType: compareNumericString
      },
      {
        Header: "Games",
        accessor: "games",
        sortType: compareNumericString
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

function compareNumericString(rowA, rowB, id, desc) {
  let a = Number.parseFloat(rowA.values[id]);
  let b = Number.parseFloat(rowB.values[id]);
  if (Number.isNaN(a)) {  // Blanks and non-numeric strings to bottom
      a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
      b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1; 
  if (a < b) return -1;
  return 0;
}

export default DuoLaneTierList;
