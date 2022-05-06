import React, { useState, useEffect, useContext, FC } from "react";
import { MainContext } from "../MainContext";
import { SkinStats } from "./SkinInterface";
import { useLocation } from "react-router-dom";
import { GameStats } from "../../GeneralInterface";
import Filter from "../../Filters/Filter";
import { GodCounterStats } from "../BuildPage.jsx";
import { calcKDA } from "../../PlayerPage/GodDisplay";

const formatStat = (stat: string) => {
  stat = stat.charAt(0).toUpperCase() + stat.slice(1);
  let underScoreIndex: number = stat.indexOf("_");
  if (underScoreIndex > -1) {
    stat =
      stat.slice(0, underScoreIndex) +
      " " +
      stat.charAt(underScoreIndex + 1).toUpperCase() +
      stat.slice(underScoreIndex + 2);
  }
  stat = stat.replace("Bot", "Minion");
  return stat;
};

const DataRow = ({
  props,
}: {
  props: Partial<SkinStats> & { games: number };
}) => {
  return (
    <div className="player-damage-info">
      {Object.entries(props).map((stat: any) => {
        if (stat[0] !== "games") {
          return (
            <>
              <span className="player-info-style">{formatStat(stat[0])}:</span>{" "}
              {stat[1].toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="helper-text">
                (avg:{" "}
                {(stat[1] / props.games).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  // maximumSignificantDigits: 2,
                })}
                )
              </span>
              <br></br>
            </>
          );
        }
      })}
    </div>
  );
};

export default function SkinStatPage(props: any) {
  const [
    god,
    setGod,
    role,
    setRole,
    rank,
    setRank,
    patch,
    setPatch,
    queueType,
    setQueueType,
    mode,
    setMode,
    matchup,
    setMatchup,
    patches,
    queueTypes,
    modes,
    ranks,
    roles,
    skin,
    setSkin,
  ] = useContext(MainContext);

  const location = useLocation<any>();
  const { skinState, url, priceFavor, priceGems, obtainability, games } =
    location.state;
  setSkin(skinState);

  const [data, setData] = useState<SkinStats>({
    assists: 0,
    camps_cleared: 0,
    damage_bot: 0,
    damage_mitigated: 0,
    damage_player: 0,
    damage_taken: 0,
    deaths: 0,
    games: 0,
    gold: 0,
    healing: 0,
    healing_self: 0,
    kills: 0,
    kills_bot: 0,
    objective_assists: 0,
    phoenix_kills: 0,
    tower_damage: 0,
    tower_kills: 0,
    wards_placed: 0,
    winRate: 0,
    wins: 0,
  });
  useEffect(() => {
    fetch(
      "/api/skinstats/".concat(
        god.replace("-", "_"),
        "/",
        skinState,
        "/",
        role,
        "/",
        rank,
        "/",
        patch,
        "/",
        queueType,
        "/",
        mode
      )
    ).then((res) =>
      res.json().then((data: SkinStats) => {
        setData(data);
      })
    );
  }, [mode, role, rank, patch, queueType, matchup, skin]);

  return (
    <div className="Godpage">
      <div className="container">
        <div className="god-container skinstats_page">
          {/* <div className="row align-items-center my-5">
            <div class="col-lg-5"></div>
            <h1 className="font-weight-light"></h1>
          </div> */}
          <div className="content-section" style={{ display: "column" }}>
            <div className="skinstats_wrapper">
              <div className="skinstats_god-link">
                <div className="skinstats-header_wrapper">
                  <div>
                    <h3>{skinState}</h3>
                  </div>
                  <figure
                    className="snip0015"
                    style={{ width: "200px", height: "250px" }}
                  >
                    <img
                      className="god-face"
                      src={url || "https://i.imgur.com/kigNdxX.png"}
                      alt={god.name || god.skin_name}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <figcaption>
                      <p>
                        {priceFavor}
                        <br></br>
                        {priceGems}
                        <br></br>
                        {obtainability}
                      </p>
                    </figcaption>
                  </figure>
                  <div>
                    {((data.games / games) * 100).toFixed(2)}{" "}
                    <span className="helper-text" style={{ marginLeft: "0px" }}>
                      Pick Rate
                    </span>{" "}
                    <span className="helper-text" style={{ marginLeft: "0px" }}>
                      |
                    </span>{" "}
                    {data.winRate}%{" "}
                    <span className="helper-text" style={{ marginLeft: "0px" }}>
                      Win Rate
                    </span>{" "}
                  </div>
                </div>
              </div>

              <div className="skinstats-number_wrapper">
                <div className="skinstats_combat">
                  <div className="content-section_header">Combat Stats</div>
                  <div className="column_wrapper">
                    <div className="column">
                      <div>
                        <span className="player-info-style">KDA: </span>{" "}
                        {data?.kills ? data.kills.toLocaleString() : 0}
                        <span style={{ color: "#5f5f7b" }}> / </span>
                        <span style={{ color: "#ff4e50" }}>{data?.deaths}</span>
                        <span style={{ color: "#5f5f7b" }}> / </span>
                        {data?.assists ? data.assists.toLocaleString() : 0}
                        <span className="helper-text">
                          {calcKDA(data.kills, data.deaths, data.assists)} KDA
                        </span>
                        <br></br>
                        <DataRow
                          props={{
                            healing: data.healing,
                            healing_self: data.healing_self,
                            games: data.games,
                          }}
                        />
                      </div>
                    </div>
                    <div className="column">
                      <div className="player-damage-info">
                        <DataRow
                          props={{
                            damage_player: data.damage_player,
                            damage_taken: data.damage_taken,
                            damage_mitigated: data.damage_mitigated,
                            games: data.games,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="skinstats_objective">
                  <div className="content-section_header">Objective Stats</div>
                  <div className="column_wrapper">
                    <div className="column">
                      <DataRow
                        props={{
                          gold: data.gold,
                          damage_bot: data.damage_bot,
                          kills_bot: data.kills_bot,
                          wards_placed: data.wards_placed,
                          games: data.games,
                        }}
                      />
                    </div>
                    <div className="column">
                      <DataRow
                        props={{
                          tower_kills: data.tower_kills,
                          phoenix_kills: data.phoenix_kills,
                          tower_damage: data.tower_damage,
                          objective_assists: data.objective_assists,
                          games: data.games,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Filter
              mode={mode}
              role={role}
              god={god}
              queueType={queueType}
              rank={rank}
              patch={patch}
              matchup={matchup}
              modeFilters={modes}
              patchFilters={patches}
              roleFilters={roles}
              rankFilters={ranks}
              queueFilters={queueTypes}
              setRank={setRank}
              setRole={setRole}
              setPatch={setPatch}
              setMode={setMode}
              setMatchup={setMatchup}
              setQueueType={setQueueType}
            />
          </div>
          <div className="skinstats_players content-section toughest-matchups">
            <div className="content-section_header">Top Player Stats</div>
            <div className={data.players ? "matchups" : "show matchups"}>
              <GodCounterStats matchups={data.players} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
