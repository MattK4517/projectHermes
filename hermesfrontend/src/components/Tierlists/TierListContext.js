import React, { useState, createContext } from "react";
import { useContext } from "react";
import { AppContext } from "../../AppContext";

export const TierListContext = createContext();

export const TierListProvider = (props) => {
  const { patch } = useContext(AppContext)
  const [god, setGod] = useState("");
  const [queueType, setQueueType] = useState("Ranked");
  const [mode, setMode] = useState("Conquest");
  const [patchState, setPatch] = useState(patch);
  const [topLink, setTopLink] = useState("https://i.imgur.com/wH3klnZ.jpg");
  const [rank, setRank] = useState("All Ranks");
  const [role, setRole] = useState("All Roles");
  return (
    <TierListContext.Provider
      value={[
        god,
        setGod,
        queueType,
        setQueueType,
        patchState,
        setPatch,
        rank,
        setRank,
        role,
        setRole,
        topLink,
        setTopLink,
        mode,
        setMode,
      ]}
    >
      {props.children}
    </TierListContext.Provider>
  );
};
