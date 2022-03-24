import React, { useState, createContext } from 'react';



export const PlayerContext = createContext();

export const PlayerProvider = props => {
    const [god, setGod] = useState("")
    const [player, setPlayer] = useState("")
    const [mode, setMode] = useState("Ranked")
    const [role, setRole] = useState("All Roles")
    const [topLink, setTopLink] = useState("")
    const [icon, setIcon] = useState("https://i.imgur.com/KgTaobI.png")
    const [playerLevel, setPlayerLevel] = useState(-1);
    const [tab, setTab] = useState("Build");
    const [patch, setPatch] = useState("9.3");
    const patches = ["9.3", "9.2", "9.1"]
    return (
        <PlayerContext.Provider value={[
            god, setGod, player, setPlayer, mode, setMode,
            role, setRole, topLink, setTopLink, icon, setIcon,
            playerLevel, setPlayerLevel, tab, setTab, patch, setPatch, patches
        ]}>
            {props.children}
        </PlayerContext.Provider>
    )
}
