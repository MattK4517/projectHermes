import React, { useContext } from "react";
import { PlayerContext } from "./PlayerContext";
import winRateColor from "../mainGodPage/WinRateColor";
import { setTopGod } from "./Player"

export default function PlayerGodSection(props) {
  const [
    god, setGod, player, setPlayer, mode, setMode,
    role, setRole, topLink, setTopLink, icon, setIcon,
    playerLevel, setPlayerLevel, tab, setTab,
  ] = useContext(PlayerContext);
  console.log(god)
  setTopLink(setTopGod(god))
  console.log(topLink)
  return (
    <div className="content-section content-section_no-padding player-specific-god">
      <div className="content-section_header played-gods_header">
        <span>{god.replaceAll("_", " ").replaceAll("-", " ")} Performance</span>
      </div>
      <div className="player-specific-god_content">
        <div>
          <div className="specific-god-basic">
            <div className="specific-image-container">
              <img
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${god
                  .toLowerCase()
                  .replaceAll("_", "-")
                  .replaceAll("'", "")}.jpg`}
                alt={god}
              />
            </div>
            <div className="specific-base-stats">
              <div className="specific-god-row">
                <div className="god-name">{god}</div>
                <div>{props.KDA} KDA</div>
              </div>
              <div className="specific-god-row" style={{ marginBottom: "6px" }}>
                <div>{props.games} games</div>
                <div className="KDA">
                  {(props.kills / props.games).toFixed(1)}
                  <span className="slash"> / </span>
                  {(props.deaths / props.games).toFixed(1)}
                  <span className="slash"> / </span>
                  {(props.assists / props.games).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
          <div className="specific-god-winrate">
            <div className="specific-god-winrate-container">
              <div className="winrate_text">
                <strong style={{ color: winRateColor(props.winRate) }}>
                  {props.winRate}%
                </strong>{" "}
                Win Rate
              </div>
              <div className="winrate_winloss">
                {props.wins}W {props.losses}L
              </div>
            </div>
            <div className="winrate_bar">
              <div
                style={{
                  height: "10px",
                  width: `${props.winRate}%`,
                  backgroundColor: "rgb(205, 220, 254)",
                }}
              />
            </div>
          </div>
          <div className="specific-multikills">
            <div className="multikill-block multikill-block_2">
              <div className="inner-block">
                <div className="multikill-header-icon">
                  <img
                    src="https://i.imgur.com/WD0BJIw.png"
                    alt="Double Kill"
                  />
                </div>
                <div className="multikill-count">{props.doubles}</div>
                <div className="multikill-label">
                  <div
                    style={{
                      fontWeight: "500",
                      textShadow: "black 0px 0px 3px",
                    }}
                  >
                    <strong>Double</strong>
                  </div>
                  <div>Kills</div>
                </div>
              </div>
            </div>
            <div className="multikill-block multikill-block_3">
              <div className="inner-block">
                <div className="multikill-header-icon">
                  <img
                    src="https://i.imgur.com/Ir6JXme.png"
                    alt="Triple Kill"
                  />
                </div>
                <div className="multikill-count">{props.triples}</div>
                <div className="multikill-label">
                  <div
                    style={{
                      color: "rgb(89, 210, 217)",
                      fontWeight: "700",
                      textShadow: "black 0px 0px 3px",
                    }}
                  >
                    Triple
                  </div>
                  <div>Kills</div>
                </div>
              </div>
            </div>
            <div className="multikill-block multikill-block_4">
              <div className="inner-block">
                <div className="multikill-header-icon">
                  <img
                    src="https://i.imgur.com/x8psc5J.png"
                    alt="Quadra Kill"
                  />
                </div>
                <div className="multikill-count">{props.quadras}</div>
                <div className="multikill-label">
                  <div
                    style={{
                      color: "rgb(0, 167, 255)",
                      fontWeight: "700",
                      textShadow: "black 0px 0px 5px",
                    }}
                  >
                    Quadra
                  </div>
                  <div>Kills</div>
                </div>
              </div>
            </div>
            <div className="multikill-block multikill-block_5">
              <div className="inner-block">
                <div className="multikill-header-icon">
                  <img src="https://i.imgur.com/ofYtxOH.png" alt="Penta Kill" />
                </div>
                <div className="multikill-count">{props.pentas}</div>
                <div className="multikill-label">
                  <div style={{ color: "rgb(255, 155, 0)", fontWeight: "700" }}>
                    Penta
                  </div>
                  <div>Kills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="additional-stats">
          <div className="additional-stats_row">
            <div className="row-icon">
              <img
                src="https://i.imgur.com/kqTxr3r.png"
                width="32"
              />
            </div>
            <div className="row-label">Max Kills</div>
            <div className="row-value">{props.maxKills}</div>
          </div>
          <div className="additional-stats_row">
            <div className="row-icon">
              <img
                src="https://i.imgur.com/pHLndKw.png"
                width="25"
              />
            </div>
            <div className="row-label">Max Deaths</div>
            <div className="row-value">{props.maxDeaths}</div>
          </div>
          <div className="additional-stats_row">
            <div className="row-icon">
              <img
                src="https://i.imgur.com/kqTxr3r.png"
                width="32"
              />
            </div>
            <div className="row-label">Average Damage</div>
            <div className="row-value">{props.avgDamage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          </div>
          <div className="additional-stats_row">
            <div className="row-icon">
              <img
                src="https://i.imgur.com/XofaIQ0.png"
                width="14"
              />
            </div>
            <div className="row-label">Average Gold</div>
            <div className="row-value">{props.avgGold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
