import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlayerContext } from './PlayerContext';
import '../Component.css';

export default function PlayerHeader(props) {
  const {
    god,
    setGod,
    player,
    setPlayer,
    queue_type,
    setMode,
    role,
    setRole,
    topLink,
    setTopLink,
    icon,
    setIcon,
    playerLevel,
    setPlayerLevel,
  } = useContext(PlayerContext);

  return (
    <div className='player-profile_header'>
      <div className='player-profile-main'>
        <div className='profile-icon-container'>
          <div className='level-header'>{playerLevel}</div>
          <div className='profile-icon-border'>
            <div className='border-notch'></div>
            <img
              className='profile-icon-image'
              src={icon ?? 'https://i.imgur.com/KgTaobI.png'}
              alt={`${player} icon`}
            />
          </div>
        </div>
        <div className='player-profile_info'>
          <div className='player-profile_info_name'>
            <div className='player-name'>
              {player}
              <Link
                to={`/player/${player}/`}
                style={{
                  fontSize: '10px',
                  backgroundColor: '#191937',
                  padding: '.25rem',
                }}
              >
                Back to Player Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
