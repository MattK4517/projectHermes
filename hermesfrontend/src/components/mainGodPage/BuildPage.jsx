import React from "react";
import useFetch from "../useFetch";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import winRateColor from "./WinRateColor";
import { styled } from "@mui/system";

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

class CreateMatchupsHelpTooltip extends React.Component {
    render() {
      return (
        <div style={{color: "white", fontSize: ".75rem"}}>
          <h3>What do these numbers mean?</h3>
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
            <div className="win-rate" style={{color: winRateColor(this.props.getMatchups.winRate)}}>
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

const CustHeader = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: "100%",
    padding: "10px",
    border: "none"
  },
  // [theme.breakpoints.up('sm')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.up('lg')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.down('lg')]: {
  //   width: "75%",
  //   fontsize: "8px"
  //   // backgroundColor: "#FFF"
  // },
}));


const ResponsiveBuild = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: "block",
  },
  // [theme.breakpoints.up('sm')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.up('lg')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.down('lg')]: {
  //   width: "75%",
  //   fontsize: "8px"
  //   // backgroundColor: "#FFF"
  // },
}));



class GodRankStats extends React.Component {
    render() {
      return (
        <div className="content-section god-rank-stats">
          <div className="win-rate">
            <div className="value" style={{color: this.props.colorStyle}}>{this.props.winrate}%</div>
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

  class BuildStatsElement extends React.Component {
    render() {
      console.log(this.props)
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
            maxWidth: "750px",
            color: "#E6E6FA",
            alignItems: "left",
            fontSize: "14px",
          }}
        >
          <h5 style={{ width: "100%", fontSize: "1rem", color: "#1E90FF" }}>
            {this.props.item.item}
          </h5>
          <div>
            <p>{this.props.item.itemShortDesc}</p>
          </div>
          <div className="item-stats">
            <ul>
              {this.props.item.itemStats.map(
                (stat) => {
                  return (
                    <li style={{left: "0"}}>
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
          <p style={{ color: "#D4AF37" }}>
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


export default function BuildPage(pagegod) {
    const { games, badmatchups, goodmatchups, items, colorStyle } = useFetch(
        pagegod.pagegod,
        pagegod.role,
        pagegod.rank,
        pagegod.patch,
        pagegod.matchup
        );
        return (
            <div className="god-build">
            <GodRankStats
              winrate={pagegod.winrate}
              games={games}
              banrate={pagegod.banrate}
              pickrate={pagegod.pickrate}
            //   url={url}
              colorStyle={colorStyle}
            />
            <div className="toughest-matchups content-section">
              <div className="content-section_header">
                  Counter Matchups&nbsp;
                  <span style={{color: "#5f5f7b", fontSize: "14px", fontWeight: "400"}}>these gods counter {pagegod.pagegod}{" "}
                  {pagegod.role}
                  </span>
                <HtmlTooltip
                    title={
                      <React.Fragment>
                        <CreateMatchupsHelpTooltip
                        god={pagegod.pagegod}
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
                  Good Matchups&nbsp;
                  <span style={{color: "#5f5f7b", fontSize: "14px", fontWeight: "400"}}>these gods get countered by {pagegod.pagegod}{" "}
                    {pagegod.role}
                  </span>
                <HtmlTooltip
                    title={
                      <React.Fragment>
                        <CreateMatchupsHelpTooltip
                        god={pagegod.pagegod}
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
            <ResponsiveBuild className="build content-section">
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
            </ResponsiveBuild>
          </div>
        )
    }