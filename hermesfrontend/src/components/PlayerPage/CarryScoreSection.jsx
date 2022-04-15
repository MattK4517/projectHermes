import React, { useContext } from "react";
import { PlayerContext } from "./PlayerContext";
import { getImageUrl } from "../Match";
export default function CarryScoreSection(props) {
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
                  .replaceAll(" ", "-")
                  .toLowerCase()}.jpg`}
              />
            </div>
            <div className="role-icon-container">
              <img src={getImageUrl(role)} />
            </div>
          </div>
        </div>
      </div>
      <div className="carry-score_section">
        <div className="carry-score_table">
          <div className="carry-score_table__row carry-score_table__headers carry-score_hard-carry">
            <div></div>
            <div>Your Stats</div>
            <div className="hide">Avg. Score</div>
            <div>Personal Record</div>
          </div>
          <div className="carry-score_table__body">
            <div className="carry-score_table__row">
              <div className="row-label">Gold Share</div>
              <div>
                <span>{props.goldShare}%</span>
              </div>
              <div className="cell_bar hide">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_hard-carry"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>{props.goldShareBest}%</span>
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

              <div className="cell_bar hide">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_hard-carry"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>{props.damageShareBest}%</span>
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
              <div className="cell_bar hide">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_teamplay"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>{props.killShareBest}%</span>
                <div className="bar-container">
                  <div
                    className="personal-record carry-score_teamplay"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="carry-score_table__row">
              <div className="row-label">Vision Score</div>
              <div>
                <span>{props.wardShare}</span>
              </div>
              <div className="cell_bar hide">
                <span>N/A</span>
                <div className="bar-container">
                  <div
                    className="avg-score carry-score_teamplay"
                    style={{ height: "100%", width: "N/A%" }}
                  ></div>
                </div>
              </div>
              <div className="cell_bar">
                <span>{props.wardShareBest}</span>
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
