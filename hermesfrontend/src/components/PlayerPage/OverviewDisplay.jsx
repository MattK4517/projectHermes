import React, { useState, useEffect, useContext } from "react";
import FilterForm from "../Filters/FilterForm";
import { PlayerContext } from "./PlayerContext";
import CarryScoreSection from "./CarryScoreSection";
import PlayerMatchups from "./PlayerMatchups";
import PlayerHeader from "./PlayerHeader";
import PlayerGodSection from "./PlayerGodSection";

export const FormatGod = (god) => {
  let firstLetter = god.charAt(0).toUpperCase();
  let firstSection = "";
  let secondCaps = "";
  let secondSection = "";
  if (god.indexOf("-") !== -1) {
    secondCaps = god.charAt(god.indexOf("-") + 1).toUpperCase();
    firstSection = god.slice(1, god.indexOf("-"));
    secondSection = god.slice(god.indexOf("-") + 2);
  } else {
    firstSection = god.slice(1);
  }
  return firstLetter + firstSection + " " + secondCaps + secondSection;
};

export default function OverviewDisplay() {
  const [
    god,
    setGod,
    player,
    setPlayer,
    mode,
    setMode,
    role,
    setRole,
    topLink,
    setTopLink,
  ] = useContext(PlayerContext);

  // console.log(window.location.href.split("/")[6])
  // console.log(window.location.href.split("/")[7].charAt(0).toUpperCase() + window.location.href.split("/")[7].slice(1))
  let fgod = window.location.href.split("/")[7];
  setGod(FormatGod(fgod).trim());
  const [goldShare, setGoldShare] = useState("");
  const [goldShareBest, setGoldShareBest] = useState("0");
  const [damageShare, setDamageShare] = useState("");
  const [damageShareBest, setDamageShareBest] = useState("0");
  const [killShare, setkillShare] = useState("");
  const [killShareBest, setKillShareBest] = useState("0");
  const [KDA, setKDA] = useState(0);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [assists, setAssists] = useState(0);
  const [games, setGames] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [triples, setTriples] = useState(0);
  const [quadras, setQuadras] = useState(0);
  const [pentas, setPentas] = useState(0);
  const [maxKills, setMaxKills] = useState(0);
  const [maxDeaths, setMaxDeaths] = useState(0);
  const [avgDamage, setAvgDamage] = useState(0);
  const [avgGold, setAvgGold] = useState(0);
  const [avgWards, setAvgWards] = useState(0);

  useEffect(() => {
    fetch(
      "/api/getplayerspecificgod/".concat(
        player,
        "/",
        god,
        "/",
        role,
        "/",
        mode
      )
    ).then((res) =>
      res.json().then((data) => {
        console.log("getplayerspecificgod", data);
        setKills(data.kills);
        setDeaths(data.deaths);
        setAssists(data.assists);
        setGames(data.games);
        setKDA(data.KDA);
        setGoldShare(data.avgGoldShare);
        setDamageShare(data.avgDamageShare);
        setkillShare(data.avgKillShare);
        setWinRate(((data.wins / data.games) * 100).toFixed(0));
        setWins(data.wins);
        setLosses(data.losses);
        setDoubles(data.killsDouble);
        setTriples(data.killsTriple);
        setQuadras(data.killsQuadra);
        setPentas(data.killsPenta);
        setMaxKills(data.maxKills);
        setMaxDeaths(data.maxDeaths);
        setAvgDamage(data.avgDamage);
        setAvgGold(data.avgGold);
        setAvgWards(data.avgWards);
      })
    );
  }, [player, role, mode]);

  const [roles, setroles] = useState([
    "Solo",
    "Jungle",
    "Mid",
    "Support",
    "Carry",
    "All Roles"
  ]);
  return (
    <div className="player-profile-page">
      <div
        className="player-profile-container content-side-padding"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="content-side-padding background-image-container">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div class="bg-container">
              <img class="background-image" src={topLink} />
            </div>
            <div class="gradient-container">
              <div class="gradient"></div>
            </div>
          </div>
        </div>
        {/* <NameForm setPlayer={setPlayer} /> */}
        <div className={player ?? "undefined"}>
          <PlayerHeader />
          <div className="filter-manager">
            <div className="filter-width-wrapper">
              <div className="filter-manager_container">
                <div className="filter-manager_label">
                  <span style={{ color: "white" }}>Filters</span>
                </div>
                {/* <div className="role-filter-container"> */}
                <FilterForm
                  filter={role}
                  god={god}
                  filters={roles}
                  setFilter={setRole}
                />
                <FilterForm
                  filter={mode}
                  god={mode}
                  filters={["Ranked", "Casual"]}
                  setFilter={setMode}
                />
                {/* </div> */}
                {/* <DropDownFilter changePatch={setPatch} patch={patch} style={{color: "white"}}/> */}
              </div>
            </div>
          </div>
        </div>
        <div className="player-content-container">
          <div className="player-content-main">
            <div className="player-side">
              <PlayerGodSection
                KDA={KDA}
                games={games}
                kills={kills}
                deaths={deaths}
                assists={assists}
                winRate={winRate}
                wins={wins}
                losses={losses}
                doubles={doubles}
                triples={triples}
                quadras={quadras}
                pentas={pentas}
                maxKills={maxKills}
                maxDeaths={maxDeaths}
                avgGold={avgGold}
                avgDamage={avgDamage}
              />
              <PlayerMatchups />
            </div>
            <div className="player-main">
              <CarryScoreSection
                goldShare={goldShare}
                goldShareBest={goldShareBest}
                damageShare={damageShare}
                damageShareBest={damageShareBest}
                killShare={killShare}
                killShareBest={killShareBest}
                wardShare={avgWards}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
