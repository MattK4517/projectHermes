import React, { useState, createContext } from 'react';



export const PlayerContext = createContext();

export const PlayerProvider = props => {
    const [god, setGod] = useState("")
    const [player, setPlayer] = useState("")
    const [queueType, setQueueType] = useState("Ranked")
    const [mode, setMode] = useState("Conquest")
    const [role, setRole] = useState("All Roles")
    const [topLink, setTopLink] = useState("")
    const [icon, setIcon] = useState("https://i.imgur.com/KgTaobI.png")
    const [playerLevel, setPlayerLevel] = useState(-1);
    const [tab, setTab] = useState("Build");
    const [patch, setPatch] = useState("9.5");
    const [inputType, setInputType] = useState("KBM");
    const patches = ["9.5", "9.4", "9.3", "9.2", "9.1"]
    const queueTypes = ["Casual", "Ranked"];
    const modes = ["Joust", "Conquest", "Duel", "Assault", "Slash", "Arena"];
    const inputTypes = ["KBM", "Controller"];
    return (
        <PlayerContext.Provider value={[
            god, setGod, player, setPlayer, queueType, setQueueType,
            role, setRole, topLink, setTopLink, icon, setIcon,
            playerLevel, setPlayerLevel, tab, setTab, patch, setPatch,
            patches, mode, setMode, queueTypes, modes, inputType, setInputType,
            inputTypes
        ]}>
            {props.children}
        </PlayerContext.Provider>
    )
}
