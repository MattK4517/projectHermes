import React, {useState, createContext } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = props => {
    const [god, setGod] = useState("")
    const [player, setPlayer] = useState("")

    return (
        <PlayerContext.Provider value={[god, setGod]}>
            {props.children}
        </PlayerContext.Provider>
    )
}