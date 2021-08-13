import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'

// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;
//     color: white;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.5rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }
//     }
//   }
// `

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 25)
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
                  {firstPageRows.map(
                    (row, i) => {
                      prepareRow(row);
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
                                routegod = "change"
                              }
                              return (
                                <div className="rt-td god" style={{ minWidth: "155px", maxWidth: "180px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                <a className="god-played gtm-tierlist-god" href={"/".concat(routegod)}>
                                  <div style={{position: "relative"}}>
                                    <div className="god-icon">
                                      <div style={{height: "30px", width: "30px"}}>
                                        <img src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`} alt={row.original.god} 
                                        style={{ height: "48px", width: "48px", transform: "scale(0.625)", transformOrigin: "0px 0px 0px" }}/>
                                      </div>
                                    </div>
                                  </div>
                                  <strong className="god-name">{row.original.god}</strong>
                                </a>
                              </div>
                              )
                            } else if (key.includes("tier")) {
                              return (
                                <div className="rt-td tier" style={{ minWidth: "50px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                  <span><b>A</b></span>
                                </div>
                              )
                            } else if (key.includes("winRate")) {
                              return(
                              <div className="rt-td win-rate" style={{ minWidth: "70px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                <span><b>{row.original.winRate}%</b></span>
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
                                      <CounterMatchupDisplay matchups={row.original.counterMatchups}/>
                                  </div>
                                )
                                } else if (key.includes("games")) {
                                  return (
                                    <div className="rt-td games" style={{ minWidth: "80px", maxWidth: "90px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                                      <span><b>{row.original.games}</b></span>
                                    </div>
                                  )
                                  }
                          })}
                        </div>
                      </div>
                    )}
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function TierList() {
  const [tierData, setTierData] = useState([]);
  const [counterMatchups, setCounterMatchups] = useState([]);
  const [role, setRole] = useState("All Roles");
  const [rank, setRank] = useState("All Ranks");
  useEffect(() => {
    fetch("/gettierlist").then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          Object.keys(data[key]).forEach((godData) => {
          setTierData((tierData) => [
            ...tierData,
            {
              god: data[key][godData].god,
              role: data[key][godData].role,
              games: data[key][godData].games,
              winRate: data[key][godData].winRate,
              pickRate: data[key][godData].pickRate,
              banRate: data[key][godData].banRate,
              wins: data[key][godData].wins,
              tier: "A",
              counterMatchups: Object.keys(data[key][godData].counterMatchups).map((matchup) => {
                return(
                  data[key][godData]["counterMatchups"][matchup].url
                )
                // [...counterMatchups, {
                //   enemy: data[key][godData]["counterMatchups"][matchup].enemy,
                // }]
              })
            },
          ]);
          // Object.keys(data[key][godData].counterMatchups).forEach((matchup) => {
          //   setCounterMatchups((counterMatchups) => [
          //     ...counterMatchups,
          //     {
          //       enemy: data[key][godData]["counterMatchups"][matchup].enemy,
          //       timesPlayed: data[key][godData]["counterMatchups"][matchup].timesPlayed,
          //       url: data[key][godData]["counterMatchups"][matchup]["url"].url,
          //       winRate: data[key][godData]["counterMatchups"][matchup].winRate,
          //       wins: data[key][godData]["counterMatchups"][matchup].wins,
          //     }
          //   ])
          // })
        });
        });
      })
    );
  }, []);
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
    ],
    []
  )

  return (
    <div id="page-content">
      <div style={{ width: "100%"}}>
        <div id="main-content" className="collapsed">
          <div id="content-wrapper">
            <div id="content">
              <div class="stats-tables-page">
                <div id="stats-tables-container-ID" className="stats-tables-container content-side-padding">
                  <div className="title-header">
                    <h1 className="tier-list">
                      <span class="title-header_main">Smite Tier List</span>
                      <span class="title-header_secondary">for All Roles, All Ranks</span>
                    </h1>
                  </div>
                  <Table columns={columns} data={tierData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




// class TierListEntry extends React.Component {
//   render () {
//     return(
//       <div className="rt-tr-group">
//         <div className="rt-tr">
//           <div className="rt-td rank" style={{ minWidth: "40px", maxWidth: "60px", flex: "1 1 100%" }}>
//             <span>1</span>
//           </div>
//           <div className="rt-td role" style={{ minWidth: "40px", maxWidth: "60px", flex: "1 1 100%" }}>
//             <span>Solo</span>
//           </div>
//           <div className="rt-td god" style={{ minWidth: "155px", maxWidth: "180px", flex: "1 1 100%" }}>
//             <a className="god-played gtm-tierlist-god" href="#">
//               <div style={{position: "relative"}}>
//                 <div className="god-icon">
//                   <div style={{height: "30px", width: "30px"}}>
//                     <div style={{ height: "48px", width: "48px", backgroundImage: "url(\"https://static.u.gg/assets/lol/riot_static/11.15.1/img/sprite/champion3.png\")", 
//                     backgroundRepeat: "no-repeat", backgroundPosition: "-336px -96px", transform: "scale(0.625)", transformOrigin: "0px 0px 0px" }}>
                  
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </a>
//           </div>
//           <div className="rt-td tier" style={{ minWidth: "50px", maxWidth: "90px", flex: "1 1 100%" }}>
//             <span><b>A</b></span>
//           </div>
//           <div className="rt-td win-rate" style={{ minWidth: "70px", maxWidth: "90px", flex: "1 1 100%" }}>
//             <span><b>{this.props.winRate}</b></span>
//           </div>
//           <div className="rt-td pick-rate" style={{ minWidth: "80px", maxWidth: "90px", flex: "1 1 100%" }}>
//             <span><b>7.50%</b></span>
//           </div>
//           <div className="rt-td ban-rate" style={{ minWidth: "70px", maxWidth: "90px", flex: "1 1 100%" }}>
//             <span><b>10.50%</b></span>
//           </div>
//           <div className="rt-td counter-matchups" style={{ minWidth: "250px", maxWidth: "270px", flex: "1 1 100%" }}>
//             <div className="counter-container">
//               <CounterMatchupDisplay />
//             </div>
//           </div>
//           <div className="rt-td games" style={{ minWidth: "80px", maxWidth: "90px", flex: "1 1 100%" }}>
//             <span><b>{this.props.games}</b></span>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

class CounterMatchupDisplay extends React.Component {
  render () {
    return(
      <div className="against-container">
        {this.props.matchups.map((matchup, index) => {
          return (
          <div className="against" key={index}>
            <a href="#">
              <div className="god-face" style={{maxWidth: "100px"}}>
                <div>
                  <img src={matchup.url} alt="" style={{height: "24px", width: "24px"}}></img>
                </div>
              </div>
            </a>
          </div>
          )
        })}
      </div>
    )
  }
}

// function TierList() {
//   const [tierData, setTierData] = useState([]);
//   const [role, setRole] = useState("All Roles");
//   const [rank, setRank] = useState("All Ranks");
//   useEffect(() => {
//     fetch("/gettierlist").then((res) =>
//       res.json().then((data) => {
//         Object.keys(data).forEach((key) => {
//           setTierData((tierData) => [
//             ...tierData,
//             {
//               games: data[key].games,
//               winRate: data[key].winRate,
//               wins: data[key].wins,
//             },
//           ]);
//         });
//       })
//     );
//   }, []);

//   return (
//     <div id="main-content" className="collapsed">
//       <div id="content-wrapper">
//         <div id="content">
//           <div className="stats-tables-page">
//             <div id="stats-tables-container-ID" className="stats-tables-container content-side-padding">
//               <div className="stats-tables__content-container" style={{color: "white"}}>
//                 <div className="tier-list-page-container">
//                   <div className="tier-list-page">
//                     <div>
//                       <testTable />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default TierList;