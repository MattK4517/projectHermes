import React, { useState, createContext, useEffect } from 'react';



export const MainContext = createContext();

export const MainProvider = props => {
    const [god, setGod] = useState("");
    const [role, setRole] = useState("");
    const [rank, setRank] = useState("All Ranks");
    const [patch, setPatch] = useState("9.3");
    const [queueType, setQueueType] = useState("Ranked")
    const [mode, setMode] = useState("Conquest")
    const [matchup, setMatchup] = useState("None");
    const [skin, setSkin] = useState("None");
    const [tab, setTab] = useState("Build")
    const patches = ["9.3", "9.2", "9.1"]
    const queueTypes = ["Casual", "Ranked"];
    const modes = ["Joust", "Conquest", "Duel"];
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
    ]
    const roles = [
        "Solo",
        "Jungle",
        "Mid",
        "Support",
        "Carry",
    ]

    useEffect(() => {
        setRank("All Ranks");
        setPatch("9.3");
        setQueueType("Ranked");
        setMode("Conquest");
        setMatchup("None");
    }, [god])
    return (
        <MainContext.Provider value={[
            god, setGod, role, setRole, rank, setRank, patch, setPatch, queueType, setQueueType,
            mode, setMode, matchup, setMatchup, patches, queueTypes, modes, ranks, roles, skin, setSkin,
            tab, setTab
        ]}>
            {props.children}
        </MainContext.Provider>
    )
}
