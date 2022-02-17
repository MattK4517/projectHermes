import React, { useEffect, useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import { HtmlTooltip, CreateItemToolTip } from "../mainGodPage/GodPageHelpers";
import MultiKillDisplay from "./MultiKillDisplay";
import FilterForm from "../Filters/FilterForm";
import { PlayerContext } from "./PlayerContext";

function PlayerBuildDisplay(props) {
  return (
    <div className={`build-container ${props.buildType}`}>
      {props.build.map((item, index) => {
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

export default function MatchDisplay(props) {
  const [
    god, setGod, player, setPlayer, mode, setMode,
    role, setRole, topLink, setTopLink, icon, setIcon,
    playerLevel, setPlayerLevel, tab, setTab, patch, setPatch
  ] = useContext(PlayerContext);
  const modes = ["Casual", "Ranked"];
  const patches = ["9.1", "8.12", "8.11"]
  if (Object.keys(props.matchList).length > 0) {
    return (
      <div className="content-section content-section_no-padding match-block">
        <div className="content-section_header played-gods_header">
          <span>Recent Matches</span>
          <div className="filter-manager">
            <div className="filter-width-wrapper">
              <div className="filter-manager_container">
                <FilterForm
                  filter={"Patch"}
                  filters={patches}
                  setFilter={setPatch}
                  className="test-div"
                />
                <FilterForm
                  filter={"Queue Type"}
                  filters={modes}
                  setFilter={setMode}
                  className="test-div"
                />
              </div>
            </div>
          </div>
        </div>
        {props.matchList.map((match) => {
          let player = {};
          let build;
          let teamOne = [];
          let teamTwo = [];
          let deaths;
          console.log(match.MatchId)
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
          if ( player["Player_Name"] &&
            player["Player_Name"].toLowerCase().includes(
              props.player.toLowerCase()
            )
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
                          <div className="queue-type">
                            {props.mode} Conquest
                          </div>
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
                                )
                                  .replaceAll("S8-", "")
                                  .toLowerCase()}.jpg`}
                                alt={player.Item_Active_1}
                              />
                            </div>
                            <div className="relic">
                              <img
                                src={`https://webcdn.hirezstudios.com/smite/item-icons/${player.Item_Active_2.replaceAll(
                                  " ",
                                  "-"
                                )
                                  .replaceAll("S8-", "")
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
                              pathname: `/Match/${match["MatchId"]}`,
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
                        <MultiKillDisplay player={player} />
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
    );
  } else {
    return (
      <div className="content-section content-section_no-padding match-block">
        <div className="content-section_header played-gods_header">
          <span>Recent Matches</span>
          <div className="filter-manager">
            <div className="filter-width-wrapper">
              <div className="filter-manager_container">
                <FilterForm
                  filter={"Patch"}
                  filters={patches}
                  setFilter={setPatch}
                />
                <FilterForm
                  filter={"Queue Type"}
                  filters={modes}
                  setFilter={setMode}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="empty-set">NO DATA TO DISPLAY</div>
      </div>
    );
  }
}
