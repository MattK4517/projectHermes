import React, { useState, createContext, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";

export const MainContext = createContext();

export const MainProvider = (props) => {
  const { patch } = useContext(AppContext)
  const [patchState, setPatchState] = useState(patch)
  const [god, setGod] = useState("");
  const [role, setRole] = useState("");
  const [rank, setRank] = useState("All Ranks");
  const [queueType, setQueueType] = useState("Ranked");
  const [mode, setMode] = useState("Conquest");
  const [matchup, setMatchup] = useState("None");
  const [skin, setSkin] = useState("None");
  const [tab, setTab] = useState("Build");
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
    setQueueType("Ranked");
    setMode("Conquest");
    setMatchup("None");
  }, [god]);

  useEffect(() => {
    if (["Assault", "Arena", "Slash"].indexOf(mode) !== -1) {
      setQueueType("Casual");
    }
    if (mode === "Duel") {
      setQueueType("Ranked")
    }
  }, [mode]);
  return (
    <MainContext.Provider
      value={{
        god: god,
        setGod: setGod,
        role: role,
        setRole: setRole,
        rank: rank,
        setRank: setRank,
        patch: patchState,
        setPatch: setPatchState,
        queueType: queueType,
        setQueueType: setQueueType,
        mode: mode,
        setMode: setMode,
        matchup: matchup,
        setMatchup: setMatchup,
        queueTypes: queueTypes,
        modes: modes,
        ranks: ranks,
        roles: roles,
        skin: skin,
        setSkin: setSkin,
        tab: tab,
        setTab: setTab,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};
