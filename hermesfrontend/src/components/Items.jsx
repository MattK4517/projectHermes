import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Component.css";
import styled from "styled-components";
import useFetch from "./useFetch";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
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

class GodHeader extends React.Component {
  render() {
    return (
      <div className="god-page-header">
        <div className="god-header-wrap">
          <div className="god-image-container">
            <div className="tier-heading">{this.props.tier}</div>
            <div className="god-page-image-border">
              <div className="notch-border"></div>
              <img
                className="god-image"
                src={this.props.url}
                alt={this.props.god}
              />
            </div>
          </div>
          <div className="god-header-info">
            <h1 className="god-label">
              <span>{this.props.god} </span>
              <span>
                Items for {this.props.role}
              </span>
            </h1>
            <div className="god-header-row2">
              <div className="god-abilities">
                <GodAbilities abilities={this.props.abilities} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class GodAbilities extends React.Component {
  render() {
    return (
      <>
        {this.props.abilities.map((ability, index) => {
          return (
            <>
              <div className="god-ability-wlabel" key={index}>
                <img src={ability.url} alt={ability.name} />
                <div className="ability-label bottom-center">{index}</div>
              </div>
            </>
          );
        })}
      </>
    );
  }
}

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

class CreateFilterToolTip extends React.Component {
  render() {
    return (
      <div className="filter-hover" style={{ maxHeight: "10px" }}>
        <p style={{ color: "white" }}>{this.props.filterLabel}</p>
      </div>
    );
  }
}

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
      <HtmlTooltip
        title={
          <React.Fragment>
            <CreateFilterToolTip filterLabel={this.props.role} />
          </React.Fragment>
        }
        placement="top"
        arrow
      >
        <form onSubmit={this.handleSubmit} className="role-filter">
          <input
            type="image"
            src={getImageUrl(this.props.role)}
            style={{ maxWidth: "36px", maxHeight: "36px" }}
            name="submit"
            value={this.props.role}
          ></input>
        </form>
      </HtmlTooltip>
    );
  }
}

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#06061f",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    border: ".5px solid gray",
    opacity: 100,
  },
}))(Tooltip);

class CreateItemToolTip extends React.Component {
  render() {
    if (this.props.index == 0) {
      this.props.item = this.props.item.item
    } else if (this.props.index == 1) {
      this.props.item = this.props.item.item2
    }
    return (
      <>
      <div
        style={{
          maxHeight: "350px",
          maxWidth: "550px",
          color: "white",
          alignItems: "left",
          fontSize: "14px",
        }}
      >
        <h5 style={{ width: "100%", fontSize: "1rem", color: "blue" }}>
          {this.props.item.item}
        </h5>
        <div>
          <p>{this.props.item.itemShortDesc}</p>
        </div>
        <div className="item-stats" style={{ paddingLeft: "5px" }}>
          <ul>
            {this.props.item.itemStats.map(
              (stat) => {
                return (
                  <li>
                    {stat[0]}: {stat[1]}
                  </li>
                );
              }
            )}
          </ul>
          <div className="item-passive">
            <p>{this.props.item.itemPassive}</p>
          </div>
        </div>
        <p style={{ color: "gold" }}>
          <b>Price:</b>{" "}
          {this.props.item.itemAbsolutePrice}(
          {this.props.item.itemRelativePrice})
          <img
            style={{ maxHeight: "20px", maxWidth: "20px", paddingLeft: "3px" }}
            src="https://i.imgur.com/XofaIQ0.png"
            alt="gold-img"
          />
        </p>
      </div>
    </>
    );
  }
}

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

function Items(god) {
  const pagegod = god.god.replaceAll("_", " ");
  const role = god.role;
  var [url, seturl] = useState(0);
  const [displaygod, setgod] = useState(0);
  const [abilities, setabilities] = useState([]);
  const [patch, setPatch] = useState("8.9")
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
  const [dispRole, setrole] = useState(role);
  const [dispRank, setrank] = useState("All Ranks");

  useEffect(()=> {
      fetch("/".concat(pagegod, "/items/", dispRole, "/", dispRank, "/", patch)).then((res) =>
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

  useEffect(() => {
    fetch("/".concat(pagegod)).then((res) =>
      res.json().then((data) => {
        setgod(pagegod);
        seturl(data.url);
      })
    );
  }, []);

  useEffect(() => {
    fetch("/".concat(pagegod, "/abilities")).then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setabilities((abilities) => [
            ...abilities,
            {
              name: data[key].name,
              url: data[key].url,
            },
          ]);
        });
      })
    );
  }, []);

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
      <div className="Godpage">
        <div className="container">
          <ImageDiv className="god-container build_page" url={url}>
            <div className="row align-items-center my-5">
              {/* <div class="col-lg-5"></div> */}
              <h1 className="font-weight-light"></h1>

              <GodHeader
                god={displaygod}
                url={url}
                tier="S"
                role={dispRole}
                rank={dispRank}
                abilities={abilities}
                patch={patch}
              />
              <div className="filter-manager">
                <div className="filter-width-wrapper">
                  <div className="filter-manager_container">
                    <div className="filter-manager_label">
                      <span style={{ color: "white" }}>Stat Filters</span>
                    </div>
                    <div className="role-filter-container">
                      {roles.map((role) => {
                        return (
                          <FilterForm
                            role={role}
                            god={pagegod}
                            roleState={setrole}
                          />
                        );
                      })}
                    </div>
                    {ranks.map((rank) => {
                      return (
                        <FilterForm
                          role={rank.replaceAll("_", " ")}
                          god={pagegod}
                          roleState={setrank}
                        />
                      );
                    })}
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
                              {patch}
                            </Button>
                            <StyledMenu {...bindMenu(popupState)}>
                              <div>
                                <MenuItem onClick={popupState.close}>
                                  <DropDownFilter changePatch={setPatch} patch={"8.9"}/>
                                </MenuItem>
                                <MenuItem onClick={popupState.close}>
                                  <DropDownFilter changePatch={setPatch} patch={"8.8"}/>
                                </MenuItem>
                              </div>
                            </StyledMenu>
                          </React.Fragment>
                        )}
                      </PopupState>
                      <Link to={"/".concat(displaygod, "/", "items")}>
                        <p>Items</p>
                      </Link>
                  </div>
                </div>
              </div>
              <div class="items-table-container">
                <Table columns={columns} data={slotOneItems} />
                <Table columns={columns} data={slotTwoItems} />
                <Table columns={columns} data={slotThreeItems} />
                <Table columns={columns} data={slotFourItems} />
                <Table columns={columns} data={slotFiveItems} />
                <Table columns={columns} data={slotSixItems} />
              </div>
            </div>
          </ImageDiv>
        </div>
      </div>
    </>
  );
}

export default Items;
