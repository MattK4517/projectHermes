import React, { useContext } from "react";
import { PlayerContext } from "./PlayerContext";

export default function CarryScoreSection(props) {
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
  return (
    <div className="content-section content-section_no-padding avg-carry-score">
      <div className="content-section_header">
        <div>Average Carry Score</div>
        <div className="align-items-center">
          <div className="header_avg-score">
            Avg:&nbsp;<strong>N/A</strong>
          </div>
          <div className="header_champion">
            <div className="champion-image-container">
              <img
                className="champion-image"
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${god
                  .replaceAll("'", "")
                  .replaceAll("_", "-")
                  .toLowerCase()}.jpg`}
              />
            </div>
            <div className="role-icon-container">
              <img src="https://static.u.gg/assets/lol/roles/all.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className="carry-score_section">
        <div className="carry-score_header">
          <div className="carry-score_header__title carry-score_hard-carry">
            <img src="https://static.u.gg/lol/static/svg/profile-champion-stats/hard-carry-icon.svg" />
            <span>Hard Carry</span>
          </div>
          <div className="carry-score_header__average carry-score_hard-carry">
            <span>Avg:</span>&nbsp;<strong>66</strong>
          </div>
        </div>
        <div className="carry-score_table">
          <div className="carry-score_table__row carry-score_table__headers carry-score_hard-carry">
            <div></div>
            <div>Your Stats</div>
            <div>Avg. Score</div>
            <div>Personal Record</div>
          </div>
          <div className="carry-score_table__body">
            <div className="carry-score_table__row">
              <div className="row-label">Gold Share</div>
              <div>
                <span>{props.goldShare}%</span>
              </div>
              <div className="cell_bar">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_hard-carry"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="personal-record carry-score_hard-carry"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="carry-score_table__row">
              <div className="row-label">Damage Share</div>
              <div>
                <span>{props.damageShare}%</span>
              </div>

              <div className="cell_bar">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_hard-carry"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="personal-record carry-score_hard-carry"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="carry-score_table__row">
              <div className="row-label">Kill Participation</div>
              <div>
                <span>{props.killShare}%</span>
              </div>
              <div className="cell_bar">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_teamplay"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="personal-record carry-score_teamplay"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
