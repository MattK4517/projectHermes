import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Link } from "react-router-dom";


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
                  id: 'wr',
                  desc: false,
                  sortType: 'basic',
              }
          ],
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
                                if (key.includes("rank")){
                                    return(
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
                                    
                                    <span className="center-aligned">{(i += 1)}</span>
                                  </div>
                                    
                                  <div
                                    className="rt-td god"
                                    style={{ 
                                      minWidth: "180px", 
                                      maxWidth: "180px", 
                                      flex: "1 1 100%",
                                      display: 'flex',
                                      alignSelf: "center",
                                      marginLeft: "10px",
                                     }}
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
                                    className="rt-td"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "175px",
                                      flex: "1 1 100%",
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      justifyContent: 'center'
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.wr}</b>
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "175px",
                                      flex: "1 1 100%",
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      justifyContent: 'center'
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span className="center-aligned">
                                      <b>{row.original.kills}</b>
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "150px",
                                      flex: "1 1 100%",
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      justifyContent: 'center'
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span className="center-aligned">
                                      <b>{row.original.dmg}</b>
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "150px",
                                      flex: "1 1 100%",
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      justifyContent: 'center'
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span className="center-aligned">
                                      <b>{row.original.gold}</b>
                                    </span>
                                  </div>

                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "100px",
                                      maxWidth: "150px",
                                      flex: "1 1 100%",
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      justifyContent: 'center'
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span className="center-aligned">
                                      <b>{row.original.games}</b>
                                    </span>
                                  </div>
                                    </>
                                    )
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

    
export default function Matchups(props) {
    const [dispRank, setRank] = useState(props.rank);
    const [dispRole, setRole] = useState(props.role);
    const [dispPatch, setPatch] = useState(props.patch);
    const god = props.pagegod;
    const [totalData, setTotalData] = useState([]);
    useEffect(() => {
        fetch("/".concat(god, "/m/", dispRole, "/", dispRank, "/", dispPatch)).then((res) =>
          res.json().then((data) => {
              setTotalData([]);
              Object.keys(data).forEach(key => {
                  setTotalData((totalData) => [
                      ...totalData,
                      {
                      dmg: data[key]["dmg"].toFixed(2),
                      kills: data[key]["kills"].toFixed(2),
                      god: data[key]["god"],
                      gold: data[key]["gold"].toFixed(),
                      wr: data[key]["wr"],
                      games: data[key]["games"],
                      }
                  ])
              })
          })
        );
      }, [dispRole, dispRank, dispPatch]);
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
            accessor: "wr",
            sortType: compareNumericString,

          },
          {
            Header: "Avg. Kill Diff",
            accessor: "kills",
            sortType: compareNumericString,

          },
          {
            Header: "Avg. Damage Diff",
            accessor: "dmg",
            sortType: compareNumericString,

          },
          {
            Header: "Avg. Gold Diff",
            accessor: "gold",
            sortType: compareNumericString,
          },
          {
            Header: "Games",
            accessor: "games",
            sortType: compareNumericString,
          },          
        ],
        []
      );
    return(
      <div id="content">
        <div class="stats-tables-page">
          <div id="stats-tables-container-ID" 
            className="stats-tables-container content-side-padding" 
            style={{paddingTop: "100px"}}
            >
          <Table columns={columns} data={totalData} />
          </div>
        </div>
      </div>
    )

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