

import React, {useState, createContext } from 'react';



export const TierListContext = createContext();

export const TierListProvider = props => {
    const [god, setGod] = useState("")
    const [player, setPlayer] = useState("")
    const [mode, setMode] = useState("Ranked")
    const [patch, setPatch] = useState("9.1");
    return (
        <TierListContext.Provider value={[
            god, setGod
            ]}>
            {props.children}
        </TierListContext.Provider>
    )
}

