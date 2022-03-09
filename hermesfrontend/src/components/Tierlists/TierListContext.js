

import React, {useState, createContext } from 'react';



export const TierListContext = createContext();

export const TierListProvider = props => {
    const [god, setGod] = useState("")
    const [mode, setMode] = useState("Ranked")
    const [patch, setPatch] = useState("9.2");
    const [topLink, setTopLink] = useState("https://i.imgur.com/wH3klnZ.jpg")
    const [rank, setRank] = useState("All Ranks");
    const [role, setRole] = useState("All Roles");
    return (
        <TierListContext.Provider value={[
            god, setGod, mode, setMode, patch, setPatch, rank, setRank,
            role, setRole, topLink, setTopLink
            ]}>
            {props.children}
        </TierListContext.Provider>
    )
}

