

import React, {useState, createContext } from 'react';



export const TierListContext = createContext();

export const TierListProvider = props => {
    const [god, setGod] = useState("Ah Muzen Cab")
    const [mode, setMode] = useState("Ranked")
    const [patch, setPatch] = useState("9.1");
    const [topLink, setTopLink] = useState("")
    return (
        <TierListContext.Provider value={[
            god, setGod, mode, setMode, patch, setPatch
            ]}>
            {props.children}
        </TierListContext.Provider>
    )
}

