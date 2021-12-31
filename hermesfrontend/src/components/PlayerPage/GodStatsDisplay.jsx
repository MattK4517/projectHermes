import React, { useState, useEffect, useContext } from "react";
import FilterForm from "../Filters/FilterForm";
import { PlayerContext } from "./PlayerContext";

export default function GodStatsDisplay() {
  const [god, setGod] = useContext(PlayerContext)
  useEffect(() => {
    fetch("/api/getplayerspecificgod/<playername>/<god>/<role>/<mode>").then((res) =>
      res.json().then((data) => {
          console.log(data)
      })
    );
}, [props.player]);
  return (
    <div className="content-section content-section_no-padding played-gods">
      {god}
      {/* <div className="content-section_header played-gods_header">
        <span>Best Gods</span>
        <FilterForm
          filter={"Queue Type"}
          filters={modes}
          setFilter={props.setMode}
        />
        
      </div> */}
    </div>
  );
}
