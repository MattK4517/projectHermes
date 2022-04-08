import React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "./PlayerContext";
import winRateColor from "../mainGodPage/WinRateColor";

const compare = (a, b) => {
  return b.timesPlayed - a.timesPlayed;
};

export default function PlayerMatchups(props) {
  const [
    god,
    setGod,
    player,
    setPlayer,
    queue_type,
    setMode,
    role,
    setRole,
    topLink,
    setTopLink,
    icon,
    setIcon,
    playerLevel,
    setPlayerLevel,
    tab,
    setTab,
    patch,
    setPatch,
  ] = useContext(PlayerContext);

  const [playerMatchups, setPlayerMatchups] = useState([]);
  useEffect(() => {
    fetch(
      "/api/playermatchups/".concat(
        player,
        "/",
        god,
        "/",
        role,
        "/9.1/",
        queue_type
      )
    ).then((res) =>
      res.json().then((data) => {
        console.log("playermatchups", data);
        let newData = Object.values(data).sort(compare);
        setPlayerMatchups([]);
        Object.keys(newData).map((god, index) => {
          if (index < 5) {
            setPlayerMatchups((playerMatchups) => [
              ...playerMatchups,
              {
                ...newData[god],
              },
            ]);
          }
        });
      })
    );
  }, [player, role, queue_type, patch]);
  return (
    <div className="content-section content-section_no-padding played-gods">
      <div className="content-section_header played-gods_header">
        <span>Common Matchups</span>
      </div>
      <div className="player-matchups-row player-matchups_header">
        <div style={{ justifyContent: "flex-start" }}>God</div>
        <div>Games</div>
        <div class="matchup-winrate">
          <div>Win Rate</div>
        </div>
      </div>
      {playerMatchups.map((matchup) => {
        return (
          <div className="player-matchups-row">
            <div className="enemy-matchup">
              <div className="god-image-player">
                <img src={matchup.url} alt={matchup.enemy} />
              </div>
              <div className="god-name">{matchup.enemy}</div>
            </div>
            <div>{matchup.timesPlayed}</div>
            <div
              className="matchup-winrate"
              style={{ color: winRateColor(matchup.winRate) }}
            >
              {matchup.winRate}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
