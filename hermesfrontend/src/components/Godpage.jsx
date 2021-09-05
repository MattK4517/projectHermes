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
              <span>{this.props.god}</span>
              <span>
                Build for {this.props.role}, {this.props.rank}
              </span>
            </h1>
            <div className="god-header-row2">
              <div className="god-abilities">
                <GodAbilities abilities={this.props.abilities} />
              </div>
              <div className="stat-explanation">
                The best win rate {this.props.god} build. The best and worst matchups for {this.props.god} and anything else you need, {this.props.rank} Smite Patch {this.props.patch}
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

class GodRankStats extends React.Component {
  render() {
    return (
      <div className="content-section god-rank-stats">
        <div className="win-rate">
          <div className="value">{this.props.winrate}%</div>
          <div className="label">Win Rate</div>
        </div>

        <div className="pick-rate">
          <div className="value">{this.props.pickrate}%</div>
          <div className="label">Pick Rate</div>
        </div>

        <div className="ban-rate">
          <div className="value">{this.props.banrate}%</div>
          <div className="label">Ban Rate</div>
        </div>

        <div className="matches">
          <div className="value">{this.props.games}</div>
          <div className="label">Matches</div>
        </div>
      </div>
    );
  }
}

class GodCounterStats extends React.Component {
  render() {
    return (
      <>
        {this.props.matchups.map((matchup, index) => {
          return <GodCounterMatchup getMatchups={matchup} key={index} />;
        })}
      </>
    );
  }
}

class CreateMatchupsHelpTooltip extends React.Component {
  render() {
    return (
      <div style={{color: "white", fontSize: ".75rem"}}>
        <h3>What do this numbers mean?</h3>
        <div>
          <p>
            the percentage shown is {this.props.god} win rate INTO the god shown
          </p>
          <p>
            meaning the lower the number the worse the matchup is for{" "}
            {this.props.god}
          </p>
        </div>
      </div>
    );
  }
}
class GodCounterMatchup extends React.Component {
  render() {
    return (
      <Link
        to={"/".concat(this.props.getMatchups.enemy.replaceAll(" ", "_"))}
        className="god-matchup"
      >
        <div className="god-icon">
          <img
            className="god-icon-style"
            src={this.props.getMatchups.url}
            alt={this.props.getMatchups.enemy}
          />
        </div>
        <div className="god-name">{this.props.getMatchups.enemy}</div>
        <hr></hr>
        <div className="matchup-stats">
          <div className="win-rate">
            <strong>{this.props.getMatchups.winRate}%</strong>
          </div>
          <div className="times-played">
            {this.props.getMatchups.timesPlayed} Matches
          </div>
        </div>
      </Link>
    );
  }
}

class BuildStats extends React.Component {
  render() {
    return (
      <>
        {this.props.stats.map((item, index) => {
          if (
            index >= this.props.lower &&
            index < this.props.upper &&
            item.item
          ) {
            return (
              <>
              <BuildStatsElement
                itemStats={item}
                key={index}
                item={item}
              />
              </>
            );
          }
        })}
      </>
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

const EnsureItem = (data, item) => {
  let ensured;
  data.map((itemdata, index) => {
    if (itemdata.itemName === item) {
      ensured = itemdata;
      return ensured;
    }
  });
  return ensured;
};

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

class BuildStatsElement extends React.Component {
  render() {
    return (
      <>
        <div className="item-row">
          <div className="item-dupe">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <CreateItemToolTip
                    item={this.props.item.item}
                  />
                </React.Fragment>
              }
              placement="top"
              arrow
            >
              <div className="item-image">
                <div className="item-image-div">
                  <img
                    src={this.props.item.item.url}
                    alt={this.props.item.item.item}
                  />
                </div>
              </div>
            </HtmlTooltip>
            <div className="item-stats">
              <div className="winrate">
                {(
                  (this.props.item.item.wins / this.props.item.item.games) *
                  100
                ).toFixed(2)}
                % WR
              </div>
              <div className="matches">
                {this.props.item.item.games} Matches
              </div>
            </div>
          </div>


          <div className="item-dupe">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <CreateItemToolTip
                    item={this.props.item.item2}
                  />
                </React.Fragment>
              }
              placement="top"
              arrow
            >
              <div className="item-image">
                <div className="item-image-div">
                  <img
                    src={this.props.item.item2.url}
                    alt={this.props.item.item2.item}
                  />
                </div>
              </div>
            </HtmlTooltip>
            <div className="item-stats">
              <div className="winrate">
                {(
                  (this.props.item.item2.wins / this.props.item.item2.games) *
                  100
                ).toFixed(2)}
                % WR
              </div>
              <div className="matches">
                {this.props.item.item2.games} Matches
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function Godpage(god) {
  const pagegod = god.god.replaceAll("_", " ");
  const role = god.role;
  var [url, seturl] = useState(0);
  const [displaygod, setgod] = useState(0);
  const [abilities, setabilities] = useState([]);
  const [patch, setPatch] = useState("current")
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
  const { games, banrate, pickrate, winrate, badmatchups, goodmatchups, items } = useFetch(
    pagegod,
    dispRole,
    dispRank,
    patch
  );
  console.log(dispRank)
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
                                  <DropDownFilter changePatch={setPatch} patch={"current"}/>
                                </MenuItem>
                                <MenuItem onClick={popupState.close}>
                                  <DropDownFilter changePatch={setPatch} patch={"8.7"}/>
                                </MenuItem>
                              </div>
                            </StyledMenu>
                          </React.Fragment>
                        )}
                      </PopupState>
                  </div>
                </div>
              </div>
              <div className="god-build">
                <GodRankStats
                  winrate={winrate}
                  games={games}
                  banrate={banrate}
                  pickrate={pickrate}
                  url={url}
                />
                <div className="toughest-matchups content-section">
                  <div className="content-section_header">
                    <span>
                      Counter Matchups these gods counter {displaygod}{" "}
                      {dispRole}
                    </span>
                    <HtmlTooltip
                        title={
                          <React.Fragment>
                            <CreateMatchupsHelpTooltip
                            god={displaygod}
                            />
                          </React.Fragment>
                        }
                        placement="top"
                        arrow
                      >
                        <div style={{paddingLeft: "25px"}}>
                          <div>
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/300px-Icon-round-Question_mark.svg.png"
                              style={{maxWidth: "24px", maxHeight: "24px"}}
                            />
                          </div>
                        </div>
                      </HtmlTooltip>
                  </div>
                  <div className="matchups">
                    <GodCounterStats matchups={badmatchups} />
                  </div>
                </div>
                <div className="toughest-matchups content-section">
                  <div className="content-section_header">
                    <span>
                      Good Matchups these gods get countered by {displaygod}{" "}
                      {dispRole}
                    </span>
                    <HtmlTooltip
                        title={
                          <React.Fragment>
                            <CreateMatchupsHelpTooltip
                            god={displaygod}
                            />
                          </React.Fragment>
                        }
                        placement="top"
                        arrow
                      >
                        <div style={{paddingLeft: "25px"}}>
                          <div>
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/300px-Icon-round-Question_mark.svg.png"
                              style={{maxWidth: "24px", maxHeight: "24px"}}
                            />
                          </div>
                        </div>
                      </HtmlTooltip>
                  </div>
                  <div className="matchups">
                    <GodCounterStats matchups={goodmatchups} />
                  </div>
                </div>
                <div className="build content-section">
                  {items.map((item, index) => {
                    if (index === 0) {
                      return (
                        <div className="starter">
                          <div className="content-section_header">Starter</div>
                          <div>
                            <BuildStats
                              stats={items}
                              lower={0}
                              upper={1}
                            />
                          </div>
                        </div>
                      );
                    } else if (index === 1) {
                      return (
                        <div className="slot1">
                          <div className="content-section_header">
                            Second Slot Options
                          </div>
                          <div>
                            <BuildStats
                              stats={items}
                              lower={1}
                              upper={2}
                            />
                          </div>
                        </div>
                      );
                    } else if (index === 2) {
                      return (
                        <div className="slot2">
                          <div className="content-section_header">
                            Third Slot Options
                          </div>
                          <div>
                            <BuildStats
                              stats={items}
                              lower={2}
                              upper={3}
                            />
                          </div>
                        </div>
                      );
                    } else if (index === 3) {
                      return (
                        <div className="slot3">
                          <div className="content-section_header">
                            Fourth Slot Options
                          </div>
                          <div>
                            <BuildStats
                              stats={items}
                              lower={3}
                              upper={4}
                            />
                          </div>
                        </div>
                      );
                    } else if (index === 4) {
                      return (
                        <div className="slot4">
                          <div className="content-section_header">
                            Fifth Slot Options
                          </div>
                          <div>
                            <BuildStats
                              stats={items}
                              lower={4}
                              upper={5}
                            />
                          </div>
                        </div>
                      );
                    } else if (index === 5) {
                      return (
                        <div className="slot5">
                          <div className="content-section_header">
                            Sixth Slot Options
                          </div>
                          <div>
                            <BuildStats
                              stats={items}
                              lower={5}
                              upper={6}
                            />
                          </div>
                        </div>
                      );
                    }
                  })}
                  {/*
                  <div className="slot5">
                    <div className="content-section_header">
                      Sixth Slot Options
                    </div>
                    <div>
                      <BuildStats stats={items} lower={5} upper={6} />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </ImageDiv>
        </div>
      </div>
    </>
  );
}

export default Godpage;
