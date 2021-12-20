import React, { useState, useEffect } from 'react';
import "../Component.css"
export default function PlayerHeader(props) {
    return(
        <div className="player-profile_header">
            <div className="player-profile-main">
                <div className="profile-icon-container">
                    <div className="level-header">
                        {props.level}
                    </div>
                    <div className="profile-icon-border">
                        <div className="border-notch"></div>
                        <img className="profile-icon-image" src={props.icon} alt={`${props.player} icon`} />
                    </div>
                </div>
                <div className="player-profile_info">
                    <div className="player-profile_info_name">
                        <div className="player-name">
                            <span>{props.player}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}