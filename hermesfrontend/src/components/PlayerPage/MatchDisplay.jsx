import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";

class CreateItemToolTip extends React.Component {
  render() {
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
            {this.props.item}
          </h5>
          {/* <div>
            <p>{this.props.item.Description}</p>
          </div>
          <div className="item-stats">
            <div style={{ marginLeft: "0px" }}>
              {this.props.item.ItemDescription.Menuitems.map((stat) => {
                return (
                  <p style={{ padding: "0px", margin: "0px" }}>
                    {stat.Description}: {stat.Value}
                  </p>
                );
              })}
            </div>
            <br></br>
            <div className="item-passive">
              <p>{this.props.item.ItemDescription.SecondaryDescription}</p>
            </div>
          </div>
          <p style={{ color: "#D4AF37" }}>
            <b>Price:</b> {this.props.item.absolutePrice}(
            {this.props.item.relativePrice})
            <img
              style={{
                maxHeight: "20px",
                maxWidth: "20px",
                paddingLeft: "3px",
              }}
              src="https://i.imgur.com/XofaIQ0.png"
              alt="gold-img"
            />
          </p> */}
        </div>
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

class PlayerBuildDisplay extends React.Component {
  render() {
    return (
      <div className={`build-container ${this.props.buildType}`}>
        {this.props.build.map((item, index) => {
          if (item) {
            return (
              <HtmlTooltip
                key={index}
                title={
                  <React.Fragment>
                    <CreateItemToolTip item={item} />
                  </React.Fragment>
                }
                placement="top"
                arrow
                style={{
                  paddingRight: "3px",
                }}
              >
                <div className="item-image">
                  <div className="item-image-div">
                    <img
                      src={`https://webcdn.hirezstudios.com/smite/item-icons/${item
                        .replaceAll(" ", "-")
                        .replaceAll("'", "")
                        .toLowerCase()}.jpg`}
                      alt={item}
                      style={{ border: "2px solid black", borderRadius: "5px" }}
                    />
                  </div>
                </div>
              </HtmlTooltip>
            );
          }
        })}
      </div>
    );
  }
}

export default function MatchDisplay(props) {
  console.log(props)
  if (Object.keys(props.matchList).length > 0) {
  return (
    <div className="content-section content-section_no-padding match-block">
      <div className="content-section_header">
        <span>Recent Matches</span>
      </div>
      {props.matchList.map((match) => {
        let player = {};
        let build;
        let teamOne = [];
        let teamTwo = [];
        let deaths;
        Object.keys(match).forEach((key, index) => {
          if (key.includes("player")) {
            if (match[key]["Win_Status"] === "Winner") {
              teamOne = [...teamOne, match[key]];
            } else {
              teamTwo = [...teamTwo, match[key]];
            }
            if (
              match[key]["Player_Name"]
                .toLowerCase()
                .includes(props.player.toLowerCase())
            ) {
              deaths = match[key].Deaths;
              if (deaths <= 0) {
                deaths = 1;
              } else {
                deaths = match[key].Deaths;
              }
              player = match[key];
              build = [
                player.Item_Purch_1,
                player.Item_Purch_2,
                player.Item_Purch_3,
                player.Item_Purch_4,
                player.Item_Purch_5,
                player.Item_Purch_6,
              ];
            }
          }
        });
        if (
          player.Player_Name.toLowerCase().includes(props.player.toLowerCase())
        ) {
          return (
            <div className="match-history">
              <div className={`match-history-large ${player.Win_Status}`}>
                <div className="match-summary">
                  {/* <div className={`line line-${player.Win_Status}`} /> */}
                  <div
                    className="content-container"
                    style={{ paddingTop: "0px" }}
                  >
                    <div className="stat-group-one">
                      <div className="r1">
                        <div className="queue-type">{props.mode} Conquest</div>
                        <div className="date">{match.Entry_Datetime}</div>
                      </div>
                      <div className="r2 r2_spacing"></div>
                      <div className="r3">
                        <div className="win-status">
                          {player.Win_Status}&nbsp;
                        </div>
                        <div className="match-length">
                          {match.Minutes}:{match.Match_Duration % 60}
                        </div>
                      </div>
                    </div>
                    <div className="stat-group-two">
                      <div className="r1">
                        <div className="god">
                          <div className="god-face">
                            <img
                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${player.godName
                                .replaceAll(" ", "-")
                                .replaceAll("'", "")
                                .toLowerCase()}.jpg`}
                              alt={player.godName}
                            />
                            <div className="player-level">
                              {player.Final_Match_Level}
                            </div>
                          </div>
                        </div>
                        <div className="relics" style={{ minWidth: "22px" }}>
                          <div className="relic">
                            <img
                              src={`https://webcdn.hirezstudios.com/smite/item-icons/${player.Item_Active_1.replaceAll(
                                " ",
                                "-"
                              ).replaceAll("S8-", "")
                              .toLowerCase()}.jpg`}
                              alt={player.Item_Active_1}
                            />
                          </div>
                          <div className="relic">
                            <img
                              src={`https://webcdn.hirezstudios.com/smite/item-icons/${player.Item_Active_2.replaceAll(
                                " ",
                                "-"
                              ).replaceAll("S8-", "")
                              .toLowerCase()}.jpg`}
                              alt={player.Item_Active_2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="stat-group-three">
                      <div className="KDA-raw">
                        {player.Kills_Player} / {player.Deaths} /{" "}
                        {player.Assists}
                      </div>
                      <div className="KDA-ratio">
                        {(
                          (player.Kills_Player + player.Assists / 2) /
                          deaths
                        ).toFixed(2)}{" "}
                        <span>KDA</span>
                      </div>
                      <div>
                        <Link
                          to={{
                            pathname: `Match/${match["MatchId"]}`,
                            target: "_blank",
                          }}
                          className="date"
                        >
                          Go to Match
                        </Link>
                      </div>
                    </div>
                    <div
                      className="stat-group-four"
                      style={{ flexDirection: "row" }}
                    >
                      <div className="items-match">
                        <div className="build" style={{ marginTop: "0px" }}>
                          <div className="build-container">
                            {build.map((item) => {
                              return (
                                <div
                                  className="item-wrapper"
                                  style={{ width: "22px", height: "22px" }}
                                >
                                  <div
                                    style={{ width: "22px", height: "22px" }}
                                  >
                                    <img
                                      style={{
                                        height: "48px",
                                        width: "48px",
                                        backgroundPosition: "-96px -96px",
                                        transform: "scale(0.458333)",
                                        transformOrigin: "0px 0px 0px",
                                      }}
                                      src={`https://webcdn.hirezstudios.com/smite/item-icons/${item
                                        .replaceAll(" ", "-")
                                        .replaceAll("'", "")
                                        .toLowerCase()}.jpg`}
                                      alt={item}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="accolades-container">
                        <div className="single-match-accolades">
                          <div className="multikill-header-icon">
                            <img
                              src="https://i.imgur.com/WD0BJIw.png"
                              alt="Double Kill"
                            />
                          </div>
                          <div className="multikill-count">
                            :{player.Kills_Double}
                          </div>
                        </div>
                        <div className="single-match-accolades">
                          <div className="multikill-header-icon">
                            <img
                              src="https://i.imgur.com/Ir6JXme.png"
                              alt="Triple Kill"
                            />
                          </div>
                          <div className="multikill-count">
                            :{player.Kills_Triple}
                          </div>
                        </div>
                        <div className="single-match-accolades">
                          <div className="multikill-header-icon">
                            <img
                              src="https://i.imgur.com/x8psc5J.png"
                              alt="Quadra Kill"
                            />
                          </div>
                          <div className="multikill-count">
                            :{player.Kills_Quadra}
                          </div>
                        </div>
                        <div className="single-match-accolades">
                          <div className="multikill-header-icon">
                            <img
                              src="https://i.imgur.com/ofYtxOH.png"
                              alt="Penta Kill"
                            />
                          </div>
                          <div className="multikill-count">
                            :{player.Kills_Penta}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="stat-group-five">
                      <div className="team">
                        {teamOne.map((teamPlayer) => {
                          let teamPlayerName;
                          if (teamPlayer.Player_Name) {
                            teamPlayerName = teamPlayer.Player_Name;
                          } else {
                            teamPlayerName = "Hidden";
                          }
                          return (
                            <div className="player-entry">
                              <div className="god-face">
                                <img
                                  src={`https://webcdn.hirezstudios.com/smite/god-icons/${teamPlayer.godName
                                    .replaceAll(" ", "-")
                                    .replaceAll("'", "")
                                    .toLowerCase()}.jpg`}
                                  alt={teamPlayer.godName}
                                  style={{
                                    height: "14px",
                                    width: "14px",
                                  }}
                                />
                              </div>
                              <div className="player-name">
                                <Link
                                  to={{
                                    pathname: `Match/${match["MatchId"]}`,
                                    target: "_blank",
                                  }}
                                >
                                  {teamPlayerName}
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="team">
                        {teamTwo.map((teamPlayer) => {
                          let teamPlayerName;
                          if (teamPlayer.Player_Name) {
                            teamPlayerName = teamPlayer.Player_Name;
                          } else {
                            teamPlayerName = "Hidden";
                          }
                          return (
                            <div className="player-entry">
                              <div className="god-face">
                                <img
                                  src={`https://webcdn.hirezstudios.com/smite/god-icons/${teamPlayer.godName
                                    .replaceAll(" ", "-")
                                    .replaceAll("'", "")
                                    .toLowerCase()}.jpg`}
                                  alt={teamPlayer.godName}
                                  style={{
                                    height: "14px",
                                    width: "14px",
                                  }}
                                />
                              </div>
                              <div className="player-name">
                                <a>{teamPlayerName}</a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  )} else {
    return(
    <div className="content-section content-section_no-padding match-block">
    <div className="content-section_header">
      <span>Recent Matches</span>
    </div>
    <div className="empty-set">NO DATA TO DISPLAY</div>
    </div>
    )
  }
}
