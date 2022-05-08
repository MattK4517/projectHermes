import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../MainContext";
import { AllGodsSkinsDisplay } from "../../Gods";
import { SkinBasic } from "./SkinInterface";
import { compare } from "../../drawer";
import FilterForm from "../../Filters/FilterForm";
import { Button } from "@mui/material";

const compareGames = (a: SkinBasic, b: SkinBasic) => {
  return a.games - b.games;
};

export default function SkinPage() {
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
  const [allSkins, setAllSkins] = useState<SkinBasic[]>([]);
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
      res.json().then((data: { skins: SkinBasic[] }) => {
        setAllSkins([...data["skins"]]);
      })
    );
  }, [mode, role, rank, patch, queueType, matchup]);

  const calcGames = (allSkins: SkinBasic[]) => {
    let games = 0;
    allSkins.map((skin) => {
      games += skin.games;
    });
    return games;
  };
  return (
    <div className="content">
      <div className="skin-page">
        <div className="skins content-side-pad" style={{ paddingTop: "25px" }}>
          {/* TODO IMPLEMENT HIGH/LOW filters for winrate and games played */}
          {/* <Button
            sx={{
              backgroundColor: "#423f61",
              color: "white",
              ":hover": {
                backgroundColor: "#423f61",
                borderRadius: "7px",
              },
            }}
            onClick={() =>
              setAllSkins((allSkins) => {
                let sortMe = [...allSkins];
                sortMe.sort(compare);
                return sortMe;
              })
            }
          >
            WINRATE
          </Button> */}
          <AllGodsSkinsDisplay
            gods={allSkins}
            godName={god}
            games={calcGames(allSkins)}
          />
        </div>
      </div>
    </div>
  );
}
