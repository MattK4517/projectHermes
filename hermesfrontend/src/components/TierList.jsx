import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'
import { FaAssistiveListeningSystems } from 'react-icons/fa'


const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    color: white;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

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
  const firstPageRows = rows

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
      <br />
    </>
  )
}

function TierList() {
  const [tierData, setTierData] = useState([]);
  const [role, setRole] = useState("All Roles");
  const [rank, setRank] = useState("All Ranks");
  useEffect(() => {
    fetch("/gettierlist").then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          Object.keys(data[key]).forEach((godData) => {
            console.log(data[key][godData])
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
              // counterMatchups: data[key].counterMatchups,
            },
          ]);
        });
        });
      })
    );
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Info",
        columns: [
          {
            Header: 'Rank',
            accessor: "",
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
            accessor: "",
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
      },
    ],
    []
  )


  return (
    <Styles>
      <Table columns={columns} data={tierData} />
    </Styles>
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
//               <CounterMatchupDisplay></CounterMatchupDisplay>
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

// class CounterMatchupDisplay extends React.Component {
//   render () {
//     return (
//       <p>WIP</p>
//     )
//   }
// }

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
//                       <div className="content-section ReactTable ugg-table-2 tier-list">
//                         <div className="rt-thead -header">
//                           <div className="rt-tr">
//                             <div className="rt-th rank">Rank</div>
//                             <div className="rt-th role">Role</div>
//                             <div className="rt-th god">God</div>
//                             <div className="rt-th tier">Tier</div>
//                             <div className="rt-th win-rate">Win Rate</div>
//                             <div className="rt-th pick-rate">Pick Rate</div>
//                             <div className="rt-th ban-rate">Ban Rate</div>
//                             <div className="rt-th counter-matchups">Counter Matchups</div>
//                             <div className="rt-th matches">Matches</div>
//                           </div>
//                         </div>
//                         <div className="rt-tbody">
//                           {tierData.map((data, index) => {
//                             return <TierListEntry winRate={data.winRate} games={data.games} />
//                           })}
//                         </div>
//                       </div>
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