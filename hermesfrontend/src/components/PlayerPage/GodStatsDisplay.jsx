import React, { useState, useEffect } from "react";
import FilterForm from "../Filters/FilterForm";

export default function GodStatsDisplay(props) {
  const modes = ["Casual", "Ranked"];
  console.log(props)
//   useEffect(() => {
//     fetch("/api/getplayergeneral/".concat(props.player)).then((res) =>
//       res.json().then((data) => {
//           console.log(data)
//       })
//     );
// }, [props.player]);
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
    </div>
  );
}
