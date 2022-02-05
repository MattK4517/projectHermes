import React from "react";
import { useState, useEffect } from "react";
import "../Component.css";
import styled from "styled-components";
import { useTable, useSortBy, usePagination } from 'react-table';
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";

export function ItemTable({ columns, data }) {
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
        <div class="grid-block" {...getTableProps()} style={{color: "white", overflow: "visible"}} role="table">
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
          <div className="grid-block-content build-path_border" role="rowgroup" {...getTableBodyProps()}>
            {firstPageRows.map(
              (row, i) => {
                prepareRow(row);
                // if (row.original.role != this.props.role && this.props.role != "All Roles"){ 
                //   console.log(row.original.role, this.props.role)
                //  }
                if (row.original.item) {
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
                )} else {
                  console.log("gere")
                  return (
                    <div className="content-section">
                      <div className="content-section_header">Build</div>
                      <div className="empty-set">NO DATA TO DISPLAY</div>
                    </div>
                  )
                }
                }
            )}
          </div>
        </div>
      </>
    )
  }

function Items(props) {
  const [patch, setPatch] = useState("9.1")
  const [slotOneItems, setSlotOneItems] = useState([]);
  const [slotTwoItems, setSlotTwoItems] = useState([]);
  const [slotThreeItems, setSlotThreeItems] = useState([]);
  const [slotFourItems, setSlotFourItems] = useState([]);
  const [slotFiveItems, setSlotFiveItems] = useState([]);
  const [slotSixItems, setSlotSixItems] = useState([]);
  const [dispRole, setrole] = useState(props.role);
  const [dispRank, setrank] = useState("All Ranks");

  useEffect(()=> {
      fetch("/api/".concat(props.pagegod, "/items/", props.role, "/", props.rank, "/", props.patch, "/", props.mode)).then((res) =>
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
  }, [props.role, props.rank, props.patch, props.mode])

  const itemColumns = React.useMemo(
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
    <div class="items-table-container content-section">
      <ItemTable columns={itemColumns} data={slotOneItems} />
      <ItemTable columns={itemColumns} data={slotTwoItems} />
      <ItemTable columns={itemColumns} data={slotThreeItems} />
      <ItemTable columns={itemColumns} data={slotFourItems} />
      <ItemTable columns={itemColumns} data={slotFiveItems} />
      <ItemTable columns={itemColumns} data={slotSixItems} />
    </div>
    </>
  );
}

export default Items;
