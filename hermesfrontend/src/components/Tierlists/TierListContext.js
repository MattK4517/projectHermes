

import React, { useState, createContext } from 'react';



export const TierListContext = createContext();

export const TierListProvider = props => {
    const [god, setGod] = useState("")
    const [queueType, setQueueType] = useState("Ranked")
    const [mode, setMode] = useState("Conquest")
    const [patch, setPatch] = useState("9.3");
    const [topLink, setTopLink] = useState("https://i.imgur.com/wH3klnZ.jpg")
    const [rank, setRank] = useState("All Ranks");
    const [role, setRole] = useState("All Roles");
    return (
        <TierListContext.Provider value={[
            god, setGod, queueType, setQueueType, patch, setPatch, rank, setRank,
            role, setRole, topLink, setTopLink, mode, setMode
        ]}>
            {props.children}
        </TierListContext.Provider>
    )
}

