import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../MainContext";
import { AllGodsSkinsDisplay } from "../../Gods";

export default function SkinPage(props) {
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
  ] = useContext(MainContext);
  const [allSkins, setAllSkins] = useState([]);

  useEffect(() => {
    fetch(
      "/api/skins/".concat(
        god,
        "/",
        role,
        "/",
        rank,
        "/",
        patch,
        "/",
        queueType,
        "/",
        mode,
        "/",
        matchup
      )
    ).then((res) =>
      res.json().then((data) => {
        console.log(data);
        setAllSkins([...data["skins"]]);
      })
    );
  }, [mode, role, rank, patch, queueType, matchup]);
  return (
    <div className="content">
      <div className="skin-page">
        <div className="skins content-side-pad" style={{ paddingTop: "25px" }}>
          <AllGodsSkinsDisplay gods={allSkins} />
        </div>
      </div>
    </div>
  );
}
