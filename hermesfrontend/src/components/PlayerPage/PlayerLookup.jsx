import React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "./PlayerContext";

export default function PlayerLookup(props) {
  const [
    god,
    setGod,
    player,
    setPlayer,
    queueType,
    setQueueType,
    role,
    setRole,
    topLink,
    setTopLink,
    icon,
    setIcon,
    playerLevel,
    setPlayerLevel,
    tab,
    setTab,
    patch,
    setPatch,
    patches,
    mode,
    setMode,
    queueTypes,
    modes,
    inputType,
    setInputType,
    inputTypes,
  ] = useContext(PlayerContext);

  const [accounts] = useState([]);
  useEffect(() => {
    fetch("/api/playeraccounts/".concat(player)).then((res) =>
      res.json().then((data) => {})
    );
  }, [player, mode, inputType]);
  return (
    <div>
      {accounts.map((account) => {
        return <div>account {account} </div>;
      })}
    </div>
  );
}
