import React, { useState, createContext, useEffect } from "react";

export const MainContext = createContext();

export const MainProvider = (props) => {
  const [god, setGod] = useState("");
  const [role, setRole] = useState("");
  const [rank, setRank] = useState("All Ranks");
  const [patch, setPatch] = useState("9.7");
  const [queueType, setQueueType] = useState("Ranked");
  const [mode, setMode] = useState("Conquest");
  const [matchup, setMatchup] = useState("None");
  const [skin, setSkin] = useState("None");
  const [tab, setTab] = useState("Build");
  const patches = ['9.7', '9.6', '9.5', '9.4', '9.3', '9.2', '9.1'];
  const queueTypes = ["Casual", "Ranked"];
  const modes = ["Joust", "Conquest", "Duel", "Assault", "Slash", "Arena"];
  const ranks = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Platinum+",
    "Diamond",
    "Diamond+",
    "Masters",
    "Grandmaster",
    "All Ranks",
  ];
  const roles = ["Solo", "Jungle", "Mid", "Support", "Carry"];

  useEffect(() => {
    setRank("All Ranks");
    setPatch("9.7");
    setQueueType("Ranked");
    setMode("Conquest");
    setMatchup("None");
  }, [god]);

  useEffect(() => {
    if (["Assault", "Arena", "Slash"].indexOf(mode) !== -1) {
      console.log("GETTING HERE");
      setQueueType("Casual");
    }
    if (mode === "Duel") {
      setQueueType("Ranked")
    }
  }, [mode]);

  return (
    <MainContext.Provider
      value={[
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
        tab,
        setTab,
      ]}
    >
      {props.children}
    </MainContext.Provider>
  );
};
