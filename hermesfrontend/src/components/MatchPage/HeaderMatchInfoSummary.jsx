import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";

function Example(props) {
  return (
    <Carousel
      autoPlay={false}
      sx={{
        overflow: "visible",
        // width: "100%",
        // height: "100%"
      }}
    >
      <div style={{ minWidth: "100%", minHeight: "100%" }}>
        <CombatDisplay
          winnerKills={props.winnerKDA[0]}
          winnerDeaths={props.winnerKDA[1]}
          winnerAssists={props.winnerKDA[2]}
          winnerDamage={props.winnerDamage}
          winnerHealing={props.winnerHealing}
          loserKills={props.loserKDA[0]}
          loserDeaths={props.loserKDA[1]}
          loserAssists={props.loserKDA[2]}
          loserDamage={props.loserDamage}
          loserHealing={props.loserHealing}
        />
      </div>

      <ObjectiveDisplay
        winnerGold={props.winnerGold}
        winnerWards={props.winnerWards}
        winnerDistance={props.winnerDistance}
        loserGold={props.loserGold}
        loserWards={props.loserWards}
        loserDistance={props.loserDistance}
      />
    </Carousel>
  );
}

function CombatDisplay(props) {
  return (
    <div className="team-stat-container">
      <p>Team Combat</p>
      <div className="KDA" style={{ marginBottom: ".5rem" }}>
        <span className="player-info-style"> Winner Side KDA: </span>{" "}
        {props.winnerKills}
        <span style={{ color: "#5f5f7b" }}> / </span>
        <span style={{ color: "#ff4e50" }}>{props.winnerDeaths}</span>
        <span style={{ color: "#5f5f7b" }}> / </span>
        {props.winnerAssists}
        <br></br>
        <span className="player-info-style"> Winner Side Dmg: </span>{" "}
        {props.winnerDamage.toLocaleString()}
        <br></br>
        <span className="player-info-style"> Winner Side Healing: </span>{" "}
        {props.winnerHealing.toLocaleString()}
        <br></br>
        <br></br>
        <span className="player-info-style"> Loser Side KDA: </span>{" "}
        {props.loserKills}
        <span style={{ color: "#5f5f7b" }}> / </span>
        <span style={{ color: "#ff4e50" }}>{props.loserDeaths}</span>
        <span style={{ color: "#5f5f7b" }}> / </span>
        {props.loserAssists}
        <br></br>
        <span className="player-info-style"> Loser Side Dmg: </span>{" "}
        {props.loserDamage.toLocaleString()}
        <br></br>
        <span className="player-info-style"> Loser Side Healing: </span>{" "}
        {props.loserHealing.toLocaleString()}
      </div>
    </div>
  );
}

function ObjectiveDisplay(props) {
  return (
    <div className="team-stat-container">
      <p>Team Objectives</p>
      <div className="KDA" style={{ marginBottom: ".5rem" }}>
        <span className="player-info-style"> Winner Side Gold: </span>{" "}
        {props.winnerGold.toLocaleString()}
        <br></br>
        <span className="player-info-style"> Winner Side Wards: </span>{" "}
        {props.winnerWards.toLocaleString()}
        <br></br>
        <span className="player-info-style"> Winner Side Distance: </span>{" "}
        {props.winnerDistance.toLocaleString()}
        <br></br>
        <br></br>
        <span className="player-info-style"> Loser Side Gold: </span>{" "}
        {props.loserGold.toLocaleString()}
        <br></br>
        <span className="player-info-style"> Loser Side Wards: </span>{" "}
        {props.loserWards.toLocaleString()}
        <br></br>
        <span className="player-info-style"> Loser Side Distance: </span>{" "}
        {props.loserDistance.toLocaleString()}
      </div>
    </div>
  );
}
export default function HeaderMatchInfoSUmmary(props) {
  const [winnerKills, setWinnerKills] = useState(0);
  const [winnerDeaths, setWinnerDeaths] = useState(0);
  const [winnerAssists, setWinnerAssists] = useState(0);
  const [winnerDamage, setWinnerDamage] = useState(0);
  const [winnerHealing, setWinnerHealing] = useState(0);
  const [winnerGold, setWinnerGold] = useState(0);
  const [winnerWards, setWinnerWards] = useState(0);
  const [winnerDistance, setWinnerDistance] = useState(0);

  const [loserKills, setLoserKills] = useState(0);
  const [loserDeaths, setLoserDeaths] = useState(0);
  const [loserAssists, setLoserAssists] = useState(0);
  const [loserDamage, setLoserDamage] = useState(0);
  const [loserHealing, setLoserHealing] = useState(0);
  const [loserGold, setLoserGold] = useState(0);
  const [loserWards, setLoserWards] = useState(0);
  const [loserDistance, setLoserDistance] = useState(0);

  useEffect(() => {
    setWinnerKills(0);
    setWinnerDeaths(0);
    setWinnerAssists(0);
    setLoserKills(0);
    setLoserDeaths(0);
    setLoserAssists(0);
    setWinnerDamage(0);
    setLoserDamage(0);
    setWinnerHealing(0);
    setLoserHealing(0);
    setWinnerGold(0);
    setWinnerWards(0);
    setWinnerDistance(0);
    setLoserGold(0);
    setLoserWards(0);
    setLoserDistance(0);
    Object.keys(props.matchData).forEach((key) => {
      if (key.includes("player")) {
        if (props.matchData[key]["Win_Status"] === "Winner") {
          setWinnerKills((winnerKills) => {
            return winnerKills + props.matchData[key]["Kills_Player"];
          });
          setWinnerDeaths((winnerDeaths) => {
            return winnerDeaths + props.matchData[key]["Deaths"];
          });
          setWinnerAssists((winnerAssists) => {
            return winnerAssists + props.matchData[key]["Assists"];
          });
          setWinnerDamage((winnerDamage) => {
            return winnerDamage + props.matchData[key]["Damage_Player"];
          });
          setWinnerHealing((winnerHealing) => {
            return (
              winnerHealing +
              props.matchData[key]["Healing"] +
              props.matchData[key]["Healing_Player_Self"]
            );
          });
          setWinnerGold((winnerGold) => {
            return winnerGold + props.matchData[key]["Gold_Earned"];
          });
          setWinnerWards((winnerWards) => {
            return winnerWards + props.matchData[key]["Wards_Placed"];
          });
          setWinnerDistance((winnerDistance) => {
            return winnerDistance + props.matchData[key]["Distance_Traveled"];
          });
        } else if (props.matchData[key]["Win_Status"] === "Loser") {
          setLoserKills((loserKills) => {
            return loserKills + props.matchData[key]["Kills_Player"];
          });
          setLoserDeaths((loserDeaths) => {
            return loserDeaths + props.matchData[key]["Deaths"];
          });
          setLoserAssists((loserAssists) => {
            return loserAssists + props.matchData[key]["Assists"];
          });
          setLoserDamage((LoserDamage) => {
            return LoserDamage + props.matchData[key]["Damage_Player"];
          });
          setLoserHealing((loserHealing) => {
            return (
              loserHealing +
              props.matchData[key]["Healing"] +
              props.matchData[key]["Healing_Player_Self"]
            );
          });
          setLoserGold((loserGold) => {
            return loserGold + props.matchData[key]["Gold_Earned"];
          });
          setLoserWards((loserWards) => {
            return loserWards + props.matchData[key]["Wards_Placed"];
          });
          setLoserDistance((loserDistance) => {
            return loserDistance + props.matchData[key]["Distance_Traveled"];
          });
        }
      }
    });
  }, [props.matchData]);
  return (
    <div className="match-summary-wrapper_header content-section">
      <div style={{ minWidth: "250px", minHeight: "175px" }}>
        <Example
          winnerKDA={[winnerKills, winnerDeaths, winnerAssists]}
          winnerDamage={winnerDamage}
          winnerHealing={winnerHealing}
          winnerGold={winnerGold}
          winnerWards={winnerWards}
          winnerDistance={winnerDistance}
          loserKDA={[loserKills, loserDeaths, loserAssists]}
          loserDamage={loserDamage}
          loserHealing={loserHealing}
          loserGold={loserGold}
          loserWards={loserWards}
          loserDistance={loserDistance}
        />
      </div>
    </div>
  );
}
