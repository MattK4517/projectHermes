import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../MainContext";
import { SkinStats } from "./SkinInterface";
import { useLocation } from "react-router-dom";
import { CombatStats } from "../../GeneralInterface";
import Filter from "../../Filters/Filter";
import { GodCounterStats } from "../BuildPage.jsx";
import { calcKDA } from "../../PlayerPage/GodDisplay";

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
  const { skinState, url, priceFavor, priceGems, obtainability } =
    location.state;
  setSkin(skinState);

  const [data, setData] = useState<any>({});
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
        console.log(data);
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
                    {data.wins}{" "}
                    <span className="helper-text" style={{ marginLeft: "0px" }}>
                      wins
                    </span>{" "}
                    | {data.games}{" "}
                    <span className="helper-text" style={{ marginLeft: "0px" }}>
                      games
                    </span>{" "}
                    | {data.winRate}%
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
                      </div>
                      <div className="player-damage-info">
                        <span className="player-info-style">
                          Total Healing:
                        </span>{" "}
                        {data.healing ? data.healing.toLocaleString() : 0}
                        <span className="helper-text">
                          (avg: {(data.healing / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Self Healing:
                        </span>{" "}
                        {data.healing_self
                          ? data.healing_self.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.healing_self / data.games).toFixed()})
                        </span>
                        <br></br>
                      </div>
                    </div>
                    <div className="column">
                      <div className="player-damage-info">
                        <span className="player-info-style">Total Damage:</span>{" "}
                        {data.damage_player
                          ? data.damage_player.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.damage_player / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Damage Taken:
                        </span>{" "}
                        {data.damage_taken
                          ? data.damage_taken.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.damage_taken / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Damage Mitigated:
                        </span>{" "}
                        {data.damage_mitigated
                          ? data.damage_mitigated.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.damage_mitigated / data.games).toFixed()}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <span>{data.healing.toLocaleString()}</span> */}
                </div>

                {/* "tower_kills", "phoenix_kills", "tower_damage", "objective_assists", "wards_placed" */}
                <div className="skinstats_objective">
                  <div className="content-section_header">Objective Stats</div>
                  <div className="column_wrapper">
                    <div className="column">
                      <div className="player-damage-info">
                        <span className="player-info-style">Total Gold:</span>{" "}
                        {data.gold ? data.gold.toLocaleString() : 0}
                        <span className="helper-text">
                          (avg: {(data.gold / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Minion Damage:
                        </span>{" "}
                        {data.damage_bot ? data.damage_bot.toLocaleString() : 0}
                        <span className="helper-text">
                          (avg: {(data.damage_bot / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Minion Kills:
                        </span>{" "}
                        {data.kills_bot ? data.kills_bot.toLocaleString() : 0}
                        <span className="helper-text">
                          (avg: {(data.kills_bot / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Wards Placed:
                        </span>{" "}
                        {data.wards_placed
                          ? data.wards_placed.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.wards_placed / data.games).toFixed()})
                        </span>
                        <br></br>
                      </div>
                    </div>
                    <div className="column">
                      <div className="player-damage-info">
                        <span className="player-info-style">
                          Total Tower Kills:
                        </span>{" "}
                        {data.tower_kills
                          ? data.tower_kills.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.tower_kills / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Phoenix Kills:
                        </span>{" "}
                        {data.phoenix_kills
                          ? data.phoenix_kills.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.phoenix_kills / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Tower Damage:
                        </span>{" "}
                        {data.tower_damage
                          ? data.tower_damage.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg: {(data.tower_damage / data.games).toFixed()})
                        </span>
                        <br></br>
                        <span className="player-info-style">
                          Total Objective Assists:
                        </span>{" "}
                        {data.objective_assists
                          ? data.objective_assists.toLocaleString()
                          : 0}
                        <span className="helper-text">
                          (avg:{" "}
                          {(data.objective_assists / data.games).toFixed()})
                        </span>
                        <br></br>
                      </div>
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
