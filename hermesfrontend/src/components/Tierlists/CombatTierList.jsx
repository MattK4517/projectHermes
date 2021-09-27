import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Link } from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { withStyles, makeStyles } from "@material-ui/core/styles";

const getImageUrl = (rank) => {
  let url = "https://i.imgur.com/LVbUJes.png";
  if (rank == "Bronze") {
    url = "https://i.imgur.com/pNAGUeR.png";
  } else if (rank == "Silver") {
    url = "https://i.imgur.com/Cm5uf15.png";
  } else if (rank == "Gold") {
    url = "https://i.imgur.com/L3BmF9F.png";
  } else if (rank == "Platinum") {
    url = "https://i.imgur.com/6M3Ezca.png";
  } else if (rank == "Diamond") {
    url = "https://i.imgur.com/dtXd0Kv.png";
  } else if (rank == "Masters") {
    url = "https://i.imgur.com/2SdBQ4o.png";
  } else if (rank == "Grandmaster") {
    url = "https://i.imgur.com/uh3i4hc.png";
  } else if (rank == "Solo") {
    url = "https://i.imgur.com/WLU0Cel.png";
  } else if (rank == "Jungle") {
    url = "https://i.imgur.com/CyXnzEO.png";
  } else if (rank == "Mid") {
    url = "https://i.imgur.com/0oQkAAZ.png";
  } else if (rank == "Support") {
    url = "https://i.imgur.com/l7CD2QM.png";
  } else if (rank == "Carry") {
    url = "https://i.imgur.com/RlRTbrA.png";
  } else if (rank == "All Roles") {
    url = "https://i.imgur.com/ajQP9zO.png";
  }
  return url;
};

class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.role };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.roleState(this.props.role);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="role-filter">
        <input
          type="image"
          src={getImageUrl(this.props.role)}
          style={{ maxWidth: "36px", maxHeight: "36px" }}
          name="submit"
          value={this.props.role}
        ></input>
      </form>
    );
  }
}

class DropDownFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.role };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.changePatch(this.props.patch);
    event.preventDefault();
  }

  render() {
      return (
        <div style={{margin: "auto", paddingRight: "1rem"}}>
          <form onSubmit={this.handleSubmit}>
            <input
              type="image"
              style={{ maxWidth: "36px", maxHeight: "36px" }}
              name="submit"
              value={this.props.patch}
            ></input>
          </form>
        </div>
      );
    }
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

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
      initialState: { pageIndex: 0 },
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
                              if (key.includes("rank")) {
                                return (
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
                                );
                              } else if (key.includes("role")) {
                                return (
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
                                      minWidth: "135px",
                                      maxWidth: "180px",
                                      flex: "1 1 100%",
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
                                );
                              } else if (key.includes("winRate")) {
                                return (
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
                                      <b>{row.original.winRate}%</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("kills")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "65px",
                                      maxWidth: "70px",
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
                                    className="rt-td"
                                    style={{
                                      minWidth: "65px",
                                      maxWidth: "70px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.deaths}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("assists")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "65px",
                                      maxWidth: "70px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.assists}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("damageD")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "60px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.damageD}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("damageTaken")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "60px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.damageTaken}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("damageMitigated")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "60px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.damageMitigated}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("healing")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "60px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.healing}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("selfHealing")) {
                                return (
                                  <div
                                    className="rt-td"
                                    style={{
                                      minWidth: "60px",
                                      maxWidth: "90px",
                                      flex: "1 1 100%",
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.selfHealing}</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes("games")) {
                                return (
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

function CombatTierList(tableType) {
  // const [patch, setPatch] = useState("8.9");
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
                kills: data[key][godData].kills,
                deaths: data[key][godData].deaths,
                assists: data[key][godData].assists,
                damageD: data[key][godData].damage_,
                damageTaken: data[key][godData].damageTaken,
                damageMitigated: data[key][godData].damageMitigated,
                healing: data[key][godData].healing,
                selfHealing: data[key][godData].selfHealing,
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
        Header: "Kills",
        accessor: "kills",
      },
      {
        Header: "Deaths",
        accessor: "deaths",
      },
      {
        Header: "Assists",
        accessor: "assists",
      },
      {
        Header: "Damage",
        accessor: "damageD",
      },
      {
        Header: "Taken",
        accessor: "damageTaken",
      },
      {
        Header: "Mitigated",
        accessor: "damageMitigated",
      },
      {
        Header: "Healing",
        accessor: "healing",
      },
      {
        Header: "Self Healing",
        accessor: "selfHealing",
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
      <div className="role-filter-container">
        <div className="filter-form">
          {roles.map((role) => {
            return <FilterForm role={role} roleState={setRole} />;
          })}
          {ranks.map((rank) => {
            return (
              <FilterForm
                role={rank.replaceAll("_", " ")}
                roleState={setRank}
              />
            );
          })}
          {/* <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  color="primary"
                  {...bindTrigger(popupState)}
                >
                  {patch}
                </Button>
                <StyledMenu {...bindMenu(popupState)}>
                  <div>
                    <MenuItem onClick={popupState.close}>
                      <DropDownFilter changePatch={setPatch} patch={"8.9"} />
                    </MenuItem>
                    <MenuItem onClick={popupState.close}>
                      <DropDownFilter changePatch={setPatch} patch={"8.8"} />
                    </MenuItem>
                  </div>
                </StyledMenu>
              </React.Fragment>
            )}
          </PopupState> */}
        </div>
      </div>
      <Table columns={columns} data={totalData} />
    </>
  );
}

export default CombatTierList;
