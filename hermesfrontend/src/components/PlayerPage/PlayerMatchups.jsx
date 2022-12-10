import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from './PlayerContext';
import winRateColor from '../mainGodPage/WinRateColor';

const compare = (a, b) => {
  return b.timesPlayed - a.timesPlayed;
};

export default function PlayerMatchups(props) {
  const [
    god,
    setGod,
    player,
    setPlayer,
    queueType,
    setQueueType,
    role,
    setRole,
    topLink,
    setTopLink,
    icon,
    setIcon,
    playerLevel,
    setPlayerLevel,
    tab,
    setTab,
    patch,
    setPatch,
    patches,
    mode,
    setMode,
    queueTypes,
    modes,
    inputType,
    setInputType,
    inputTypes,
  ] = useContext(PlayerContext);

  const [playerMatchups, setPlayerMatchups] = useState([]);
  useEffect(() => {
    fetch(
      '/api/playermatchups/'.concat(
        player,
        '/',
        god,
        '/',
        role,
        '/',
        patch,
        '/',
        queueType,
        '/',
        mode
      )
    ).then((res) =>
      res.json().then((data) => {
        let newData = Object.values(data).sort(compare);
        setPlayerMatchups([]);
        Object.keys(newData).map((god, index) => {
          if (index < 5) {
            setPlayerMatchups((playerMatchups) => [
              ...playerMatchups,
              {
                ...newData[god],
              },
            ]);
          }
        });
      })
    );
  }, [player, role, queueType, patch, mode]);
  return (
    <div className='content-section content-section_no-padding played-gods'>
      <div className='content-section_header played-gods_header'>
        <span>Common Matchups</span>
      </div>
      <div className='player-matchups-row player-matchups_header'>
        <div style={{ justifyContent: 'flex-start' }}>God</div>
        <div>Games</div>
        <div class='matchup-winrate'>
          <div>Win Rate</div>
        </div>
      </div>
      {playerMatchups.map((matchup) => {
        return (
          <div className='player-matchups-row'>
            <div className='enemy-matchup'>
              <div className='god-image-player'>
                <img
                  src={`https://webcdn.hirezstudios.com/smite/god-icons/${matchup.enemy
                    .toLowerCase()
                    .replaceAll("'", '')
                    .replaceAll(' ', '-')}.jpg`}
                  alt={matchup.enemy}
                />
              </div>
              <div className='god-name'>{matchup.enemy}</div>
            </div>
            <div>{matchup.timesPlayed}</div>
            <div
              className='matchup-winrate'
              style={{ color: winRateColor(matchup.winRate) }}
            >
              {matchup.winRate}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
