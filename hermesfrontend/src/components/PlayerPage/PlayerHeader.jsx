import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from "./PlayerContext"
import "../Component.css"
import  PlayerTabs from './PlayerTabs';

export default function PlayerHeader(props) {
    const [
        god,
        setGod,
        player,
        setPlayer,
        mode,
        setMode,
        role,
        setRole,
        topLink,
        setTopLink,
        icon,
        setIcon,
        playerLevel,
        setPlayerLevel,
      ] = useContext(PlayerContext);

    return(
        <div className="player-profile_header">
            <div className="player-profile-main">
                <div className="profile-icon-container">
                    <div className="level-header">
                        {playerLevel}
                    </div>
                    <div className="profile-icon-border">
                        <div className="border-notch"></div>
                        <img className="profile-icon-image" src={icon} alt={`${player} icon`} />
                    </div>
                </div>
                <div className="player-profile_info">
                    <div className="player-profile_info_name">
                        <div className="player-name">
                            <span>{player}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{paddingTop: "36px"}}>
                <PlayerTabs/>
            </div>
        </div>
    )
}