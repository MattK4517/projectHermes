import React from "react";
import { useState, useEffect } from "react";
import "../Component.css";
import styled from "styled-components";
import { useTable, useSortBy, usePagination } from 'react-table';

const ImageDiv = styled.div`
  background-position: 75% -100%;
  background: repeat no-repeat,
    radial-gradient(400px 200px at 75% 20%, rgba(7, 7, 32, 0) 0%, #070720 100%),
    linear-gradient(to right, #070720 30%, rgba(7, 7, 32, 0.6) 100%),
    url(${(props) =>
      props.url
        ? props.url.replace("icons", "cards")
        : "https://i.ytimg.com/vi/xAPsmI_zDZs/maxresdefault.jpg"});
`;




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
  }
  return url;
};

// class CreateItemToolTip extends React.Component {
//   render() {
//     if (this.props.index == 0) {
//       this.props.item = this.props.item.item
//     } else if (this.props.index == 1) {
//       this.props.item = this.props.item.item2
//     }
//     return (
//       <>
//       <div
//         style={{
//           maxHeight: "350px",
//           maxWidth: "550px",
//           color: "white",
//           alignItems: "left",
//           fontSize: "14px",
//         }}
//       >
//         <h5 style={{ width: "100%", fontSize: "1rem", color: "blue" }}>
//           {this.props.item.item}
//         </h5>
//         <div>
//           <p>{this.props.item.itemShortDesc}</p>
//         </div>
//         <div className="item-stats" style={{ paddingLeft: "5px" }}>
//           <ul>
//             {this.props.item.itemStats.map(
//               (stat) => {
//                 return (
//                   <li>
//                     {stat[0]}: {stat[1]}
//                   </li>
//                 );
//               }
//             )}
//           </ul>
//           <div className="item-passive">
//             <p>{this.props.item.itemPassive}</p>
//           </div>
//         </div>
//         <p style={{ color: "gold" }}>
//           <b>Price:</b>{" "}
//           {this.props.item.itemAbsolutePrice}(
//           {this.props.item.itemRelativePrice})
//           <img
//             style={{ maxHeight: "20px", maxWidth: "20px", paddingLeft: "3px" }}
//             src="https://i.imgur.com/XofaIQ0.png"
//             alt="gold-img"
//           />
//         </p>
//       </div>
//     </>
//     );
//   }
// }

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
        initialState: {
          sortBy: [
              {
                  id: 'games',
                  desc: true
              }
          ]
        }

      },
      useSortBy
    )
  
    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows
  
    return (
      <>
        <div class="grid-block" {...getTableProps()} style={{color: "white"}} role="table">
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
          <div className="grid-block-content" role="rowgroup" {...getTableBodyProps()}>
            {firstPageRows.map(
              (row, i) => {
                prepareRow(row);
                // if (row.original.role != this.props.role && this.props.role != "All Roles"){ 
                //   console.log(row.original.role, this.props.role)
                //  }
                return (
                  <div className="item-row" role="row" {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      const {key, role} = cell.getCellProps()
                      let item = row.original.item.replaceAll("_"," ")
                      item = item.replaceAll("'", "")
                      item = item.replaceAll(" ", "-")
                      let url = `https://webcdn.hirezstudios.com/smite/item-icons/${item.toLowerCase()}.jpg`
                      if (key.includes("item")) {
                        return(
                          <div className="item-image">
                          <div className="item-image-div">
                            <img
                              src={url}
                              alt={row.original.item}
                            />
                          </div>
                        </div>
                        )
                      } else if (key.includes("games")) {
                        return (
                          <div style={{ minWidth: "30px", maxWidth: "40px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                            <span><b>{row.original.games}</b></span>
                          </div>
                        )
                      } else if (key.includes("winRate")) {
                        return(
                        <div style={{ minWidth: "20px", maxWidth: "40px", flex: "1 1 100%" }} {...cell.getCellProps()}>
                          <span><b>{row.original.winRate}%</b></span>
                        </div>
                        )
                      } 
                    }) }
                  </div>
                )}
                // }
            )}
          </div>
        </div>
      </>
    )
  }

function Items(pagegod) {
  console.log(pagegod)
  var [url, seturl] = useState(0);
  const [displaygod, setgod] = useState(0);
  const [abilities, setabilities] = useState([]);
  const [patch, setPatch] = useState("8.10")
  const [slotOneItems, setSlotOneItems] = useState([]);
  const [slotTwoItems, setSlotTwoItems] = useState([]);
  const [slotThreeItems, setSlotThreeItems] = useState([]);
  const [slotFourItems, setSlotFourItems] = useState([]);
  const [slotFiveItems, setSlotFiveItems] = useState([]);
  const [slotSixItems, setSlotSixItems] = useState([]);
  const [roles, setroles] = useState([
    "Solo",
    "Jungle",
    "Mid",
    "Support",
    "Carry",
  ]);
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
  const [dispRole, setrole] = useState(pagegod.role);
  const [dispRank, setrank] = useState("All Ranks");

  useEffect(()=> {
      fetch("/".concat(pagegod.pagegod, "/items/", dispRole, "/", dispRank, "/", patch)).then((res) =>
      res.json().then((data) => {
        setSlotOneItems([])
        setSlotTwoItems([])
        setSlotThreeItems([])
        setSlotFourItems([])
        setSlotFiveItems([])
        setSlotSixItems([])
          Object.keys(data).forEach((slot) => {
              Object.keys(data[slot]).forEach((item) => {
                  if (data[slot][item]["games"] > 3) {
                    if (slot == "slot1") {
                        setSlotOneItems((items) => [
                            ...items,
                            {
                                item: item,
                                games: data[slot][item]["games"],
                                winRate: (data[slot][item]["wins"]/data[slot][item]["games"] * 100).toFixed(2),
                            }
                        ])
                    } else if (slot == "slot2") {
                        setSlotTwoItems((items) => [
                            ...items,
                            {
                                item: item,
                                games: data[slot][item]["games"],
                                winRate: (data[slot][item]["wins"]/data[slot][item]["games"] * 100).toFixed(2),
                            }
                        ])
                    } else if (slot == "slot3") {
                        setSlotThreeItems((items) => [
                            ...items,
                            {
                                item: item,
                                games: data[slot][item]["games"],
                                winRate: (data[slot][item]["wins"]/data[slot][item]["games"] * 100).toFixed(2),
                            }
                        ])
                    } else if (slot == "slot4") {
                        setSlotFourItems((items) => [
                            ...items,
                            {
                                item: item,
                                games: data[slot][item]["games"],
                                winRate: (data[slot][item]["wins"]/data[slot][item]["games"] * 100).toFixed(2),
                            }
                        ])
                    } else if (slot == "slot5") {
                        setSlotFiveItems((items) => [
                            ...items,
                            {
                                item: item,
                                games: data[slot][item]["games"],
                                winRate: (data[slot][item]["wins"]/data[slot][item]["games"] * 100).toFixed(2),
                            }
                        ])
                    } else if (slot == "slot6") {
                        setSlotSixItems((items) => [
                            ...items,
                            {
                                item: item,
                                games: data[slot][item]["games"],
                                winRate: (data[slot][item]["wins"]/data[slot][item]["games"] * 100).toFixed(2),
                            }
                        ])
                    }
                }
              })

          })
      }))
  }, [dispRole, dispRank, patch])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Items',
        accessor: "item",
      },
      {
        Header: 'Games',
        accessor: "games",
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
      },
    ]
    ,
    []
  )

  return (
    <>
    <div class="items-table-container">
      <Table columns={columns} data={slotOneItems} />
      <Table columns={columns} data={slotTwoItems} />
      <Table columns={columns} data={slotThreeItems} />
      <Table columns={columns} data={slotFourItems} />
      <Table columns={columns} data={slotFiveItems} />
      <Table columns={columns} data={slotSixItems} />
    </div>
    </>
  );
}

export default Items;
