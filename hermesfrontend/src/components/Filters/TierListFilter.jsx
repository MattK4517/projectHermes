import React, { useState, useContext } from "react";
import FilterForm from "./FilterForm";
import { TierListContext } from "../Tierlists/TierListContext";

export default function TierListFilter(props) {
  const [
    god,
    setGod,
    queue_type,
    setMode,
    patch,
    setPatch,
    rank,
    setRank,
    role,
    setRole,
    topLink,
    setTopLink,
  ] = useContext(TierListContext);

  const [roles, setRoles] = useState([
    "Solo",
    "Jungle",
    "Mid",
    "Support",
    "Carry",
    "All Roles",
  ]);
  const [ranks, setranks] = useState([
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Masters",
    "Grandmaster",
    "All Ranks",
  ]);

  return (
    <div className="filter-form">
      <FilterForm
        filter={role}
        filters={roles}
        role={role}
        setFilter={setRole}
      />
      <FilterForm
        filter={rank}
        filters={ranks}
        role={rank}
        setFilter={setRank}
      />
      <FilterForm
        filter={queue_type}
        god={"None"}
        filters={["Ranked", "Casual"]}
        setFilter={setMode}
        rankSet={setRank}
      />

      <FilterForm
        filter={patch}
        god={"None"}
        filters={["9.3", "9.2", "9.1"]}
        setFilter={setPatch}
        rankSet={setRank}
      />
    </div>
  );
}
