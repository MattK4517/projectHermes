import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { FilterForm } from "../Filters/FilterForm";
import winRateColor from '../mainGodPage/WinRateColor';
import Tooltip from "@material-ui/core/Tooltip";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#06061f",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    border: ".5px solid gray",
    opacity: 100,
  },
}))(Tooltip);

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
    usePagination,
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows
  return (
    <>
    <div className="stats-tables__content-container">
      <div className="tier-list-page-container" style={{ width: "100%" }}>
        <div className="tier-list-page">
          <div>
            <div class="content-section ReactTable ugg-table-2 tier-list" role="table" {...getTableProps()} >
                <div class= "rt-thead -header">
                  {headerGroups.map(headerGroup => (
                    <div class="rt-tr " role="row" {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        
                        <div class={"rt-th inline-".concat(column.id)} {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''}
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
                        <div className="rt-tr" role="row" {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            const {key, role} = cell.getCellProps()
                            if (key.includes("rank")) {
                            return (
                              <div className="rt-td rank" style={{ minWidth: "40px", maxWidth: "60px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                <span>{i+=1}</span>
                              </div>
                            ) } else if (key.includes("role")) {
                              return (
                            <div className="rt-td role" style={{ minWidth: "40px", maxWidth: "60px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                              <span>{row.original.role}</span>
                            </div> )
                            } else if (key.includes("god")) {
                              let god = row.original.god.toLowerCase().replaceAll(" ", "-");
                              let routegod = row.original.god.replaceAll(" ", "_")
                              if (row.original.god == "Chang\'e"){
                                routegod = "Chang\'e"
                                god = "change"
                              }
                              return (
                                <div className="rt-td god" style={{ minWidth: "155px", maxWidth: "180px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                <Link className="god-played gtm-tierlist-god" to={"/".concat(routegod)}>
                                  <div style={{position: "relative"}}>
                                    <div className="god-icon">
                                      <div style={{height: "30px", width: "30px"}}>
                                        <img src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`} alt={row.original.god} 
                                        style={{ height: "48px", width: "48px", transform: "scale(0.625)", transformOrigin: "0px 0px 0px" }}/>
                                      </div>
                                    </div>
                                  </div>
                                  <strong className="god-name">{row.original.god}</strong>
                                </Link>
                              </div>
                              )
                            } else if (key.includes("tier")) {
                              return (
                                <div className="rt-td tier" style={{ minWidth: "50px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                  <span><b>{row.original.tier}</b></span>
                                </div>
                              )
                            } else if (key.includes("winRate")) {
                              return(
                              <div className="rt-td win-rate" style={{ minWidth: "70px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                <span><b style={{color: winRateColor(row.original.winRate)}}>{row.original.winRate}%</b></span>
                              </div>
                              )
                            } else if (key.includes("pickRate")) {
                              return (
                                <div className="rt-td pick-rate" style={{ minWidth: "80px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                  <span><b>{row.original.pickRate}%</b></span>
                                </div>
                              )
                            } else if (key.includes("banRate")) {
                              return (
                                <div className="rt-td ban-rate" style={{ minWidth: "70px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                  <span><b>{row.original.banRate}%</b></span>
                                </div>
                              )
                              } else if (key.includes("counterMatchups")) {
                                return (
                                  <div className="rt-td against" style={{ minWidth: "250px", maxWidth: "270px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                      <CounterMatchupDisplay god={row.original.god} matchups={row.original.counterMatchups}/>
                                  </div>
                                )
                                } else if (key.includes("games")) {
                                  return (
                                    <div className="rt-td games" style={{ minWidth: "80px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                      <span><b>{row.original.games}</b></span>
                                    </div>
                                  )
                                }
                          }) }
                        </div>
                      </div>
                      )}
                      // }
                  )}
                </div>
              </div>
              <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  {'>>'}
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </span>
                <span>
                  | Go to page:{' '}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={e => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      gotoPage(page)
                    }}
                    style={{ width: '100px' }}
                  />
                </span>{' '}
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
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
  )
}

const GetColumnType = (tableType) => {
  let columns;
  if (tableType == "Regular"){
    columns = [
      {
        Header: 'Rank',
        accessor: "rank",
      },
      {
        Header: 'Role',
        accessor: "role",
      },
      {
        Header: "God",
        accessor: "god",
      },
      {
        Header: "Tier",
        accessor: "tier",
      },
      {
        Header: 'Win Rate',
        accessor: 'winRate',
      },
      {
        Header: 'Pick Rate',
        accessor: 'pickRate',
      },
      {
        Header: 'Ban Rate',
        accessor: 'banRate',
      },
      {
        Header: "Counter Matchups",
        accessor: "counterMatchups",
      },
      {
        Header: 'Games',
        accessor: 'games',
      },
    ]
  } else if (tableType == "Combat") {
    columns = [
      {
        Header: 'Rank',
        accessor: "rank",
      },
      {
        Header: 'Role',
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
        Header: 'Kills',
        accessor: 'kills',
      },
      {
        Header: 'Deaths',
        accessor: 'deaths',
      },
      {
        Header: 'Assists',
        accessor: 'assists',
      },
      {
        Header: "Damage",
        accessor: "damage",
      },
      {
        Header: "Damage Taken",
        accessor: "damageTaken",
      },
      {
        Header: "Damage Mitigated",
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
        Header: 'Games',
        accessor: 'games',
      },
    ]
  }
  return columns
}

const compare = (a, b) => {
  return a.winRate - b.winRate
}

function TierList(tableType) {
  // const [patch, setPatch] = useState("8.9");
  const [totalData, setTotalData] = useState([]);
  const [counterMatchups, setCounterMatchups] = useState([]);
  const [roles, setRoles] = useState(["Solo", "Jungle", "Mid", "Support", "Carry", "All Roles"]);
  const [role, setRole] = useState("All Roles")
  const [ranks, setranks] = useState(["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Masters", "Grandmaster", "All_Ranks"])
  const [dispRank, setRank] = useState("All_Ranks")

  useEffect(() => {
    //"/gettierlist/".concat(dispRank, "/", role, "/", tableType.tableType, "/", patch
    fetch("/api/gettierlist/".concat(dispRank, "/", role, "/", tableType.tableType)).then((res) =>
      res.json().then((data) => {
        setTotalData([]);
        Object.keys(data).forEach((key, index) => {
              Object.keys(data[key]).forEach((godData) => {
                let matchups = Object.values(data[key][godData].counterMatchups).sort(compare)
                setTotalData((totalData) => [
                  ...totalData,
                  {
                    god: data[key][godData].god,
                    role: data[key][godData].role,
                    games: data[key][godData].games,
                    winRate: data[key][godData].winRate,
                    pickRate: data[key][godData].pickRate,
                    banRate: data[key][godData].banRate,
                    wins: data[key][godData].wins,
                    tier: data[key][godData].tier,
                    counterMatchups: matchups.map((matchup, index) => {
                      return(
                        [matchup.url, matchup.enemy, matchup.winRate, matchup.timesPlayed]
                      )
                    })
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
        Header: 'Rank',
        accessor: "rank",
      },
      {
        Header: 'Role',
        accessor: "role",
      },
      {
        Header: "God",
        accessor: "god",
      },
      {
        Header: "Tier",
        accessor: "tier",
      },
      {
        Header: 'Win Rate',
        accessor: 'winRate',
        sortType: compareNumericString
        
      },
      {
        Header: 'Pick Rate',
        accessor: 'pickRate',
        sortType: compareNumericString
        
      },
      {
        Header: 'Ban Rate',
        accessor: 'banRate',
        sortType: compareNumericString
        
      },
      {
        Header: "Counter Matchups",
        accessor: "counterMatchups",
      },
      {
        Header: 'Games',
        accessor: 'games',
      },
    ]
    ,
    []
  )
  return (
    <>
        <div className="filter-form">
          <FilterForm filter={role} filters={roles} role={role}  setFilter={setRole}/>
          <FilterForm filter={dispRank.replaceAll("_", " ")} filters={ranks} role={dispRank.replaceAll("_", " ")} setFilter={setRank}/>
        </div>
    <Table columns={columns} data={totalData}/>
  </>
  )
}

class CounterMatchupDisplay extends React.Component {
  render () {
    return(
      <div className="against-container">
        {this.props.matchups.map((matchup, index) => {
          // console.log(matchup);
          if (index < 9) {
            let routegod = matchup[1].replaceAll(" ", "_")
            let styling;
            if (matchup[2] < 50){
              styling = {height: "24px", width: "24px"}
            } else {
              styling = {height: "24px", width: "24px", opacity: ".4", filter: "grayscale(100%)"}
            }
            return (
              <HtmlTooltip
              title={
                <React.Fragment>
                  <CreateMatchupToolTip
                    god={this.props.god}
                    winrate={matchup[2]}
                    enemy={matchup[1]}
                    enemyURL={matchup[0]}
                    games={matchup[3]}
                  />
                </React.Fragment>
              }
              placement="top"
              arrow
            >
            <div className="against" key={index}>
              <Link to={"/".concat(routegod)}>
                <div className="god-face" style={{maxWidth: "100px"}}>
                  <div>
                    <img src={matchup[0]} alt={matchup[1]} style={styling}></img>
                  </div>
                </div>
              </Link>
            </div>
            </HtmlTooltip>
            )
          }
        })}
      </div>
    )
  }
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


class CreateMatchupToolTip extends React.Component {
  render() {
    return (
      <div className="matchup-tooltip-container">
        <div className="matchup-tooltip">
          <div className="god-icon">
            <div style={{height: "30px", width: "30px"}}>
              <img src={`https://webcdn.hirezstudios.com/smite/god-icons/${this.props.god.replaceAll(" ", "-").replaceAll("'","").toLowerCase()}.jpg`} alt={this.props.god} 
                style={{ height: "48px", width: "48px", transform: "scale(0.625)", transformOrigin: "0px 0px 0px" }}/>
            </div>
          </div>
            <span style={{color: "white",  paddingTop: ".3rem"}}>wins&nbsp;<b style={{color: winRateColor(this.props.winrate)}}>{this.props.winrate}%</b>&nbsp;vs&nbsp;</span>
          <div className="god-icon">
            <div style={{height: "30px", width: "30px"}}>
              <img src={this.props.enemyURL} alt={this.props.enemy} 
                style={{ height: "48px", width: "48px", transform: "scale(0.625)", transformOrigin: "0px 0px 0px" }}/>
            </div>
          </div>
        </div>
          <p>{this.props.games} games</p>
        </div>
    );
  }
}

export default TierList;
