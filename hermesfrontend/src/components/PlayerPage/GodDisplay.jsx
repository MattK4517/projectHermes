import React from "react";
import FilterForm from "../Filters/FilterForm";

const calcKDA = (kills, deaths, assists) => {
  return ((kills + assists / 2) / deaths).toFixed(2);
};

export default function GodDisplay(props) {
  const modes = ["Casual", "Ranked"];
  return (
    <div className="content-section content-section_no-padding played-gods">
      <div className="content-section_header played-gods_header">
        <span>Best Gods</span>
        <FilterForm
          filter={"Queue Type"}
          filters={modes}
          setFilter={props.setMode}
        />
      </div>
      <div className="god-list">
        {props.godList.map((god) => {
          return (
            <a href="#" className="god-performance">
              <div className="god-face">
                <div style={{ height: "30px", width: "30px", borderRadius: "3px" }}>
                  <img
                    src={`https://webcdn.hirezstudios.com/smite/god-icons/${god.god
                      .replaceAll(" ", "-")
                      .toLowerCase()}.jpg`}
                    alt={god.god}
                    style={{
                      height: "48px",
                      width: "48px",
                      transform: "scale(0.625)",
                      transformOrigin: "0px 0px 0px",
                    }}
                  />
                </div>
              </div>
              <div className="god-stats">
                <div className="god-stats_col god-stats_col-1">
                  <div className="god-name">{god.god}</div>
                </div>
                <div className="god-stats_col god-stats_col-2">
                  <div className="kda-ratio">
                    {calcKDA(god.kills, god.deaths, god.assists)}
                  </div>
                  <div className="kda-split">
                    <span>{god.kills}</span>&nbsp;
                    <span className="slash">/</span>&nbsp;
                    <span>{god.deaths}</span>&nbsp;
                    <span className="slash">/</span>&nbsp;
                    <span>{god.assists}</span>
                  </div>
                </div>
                <div className="god-stats_col god-stats_col-3">
                  <div className="win-rate">
                    <strong>{god.winRate}%</strong>
                  </div>
                  <div className="total-games">{god.matches} games</div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
