import React, { useState, useEffect, useContext } from 'react';
import ItemBuffs from './ItemBuffs';
import { DamageContext } from './DamageContext';
import CombatStatSection from './CombatStatSection';
import { calcBuildStats } from '../Match';
import { physGods, magGods, physicalItems, magicalItems } from '../constants';
import DamageOut, { DamageOutAA } from './DamageOut';
import { useGetBuildFetch } from './DmgCalcHelper';
import GodSelectionBox from './GodSelectionBox';
import BuildSection from './BuildSection';

export default function DamageCalculator() {
  const [
    allgods,
    god,
    setGod,
    build,
    setBuild,
    items,
    enemy,
    setEnemy,
    enemyBuild,
    setEnemyBuild,
    enemyItems,
    setEnemyItems,
  ] = useContext(DamageContext);
  const [levels, setLevels] = useState({
    1: 5,
    2: 5,
    3: 5,
    4: 5,
    5: 5,
  });
  let td = 0;
  const [totalDamage, setTotalDamage] = useState(0);
  const [message, setMessage] = useState([]);
  const [totalDamageAA, setTotalDamageAA] = useState(0);
  const [messageAA, setMessageAA] = useState([]);
  const [combatStats, setCombatStats] = useState({});
  const [defensiveStats, setDefensiveStats] = useState({});

  const requestOptionsAutoAttck = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      god: god,
      build: [...build],
      enemy: enemy,
      enemyBuild: [...enemyBuild],
    }),
  };
  const buildOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      god: god,
      levels: levels,
      build: [...build],
      enemy: enemy,
      enemyBuild: [...enemyBuild],
    }),
  };

  const enemyBuildOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      god: enemy,
      levels: levels,
      build: [...enemyBuild],
    }),
  };

  useEffect(() => {
    fetch('/api/getdmgcalc/', buildOptions).then((res) =>
      res.json().then((data) => {
        setMessage([]);
        td = 0;
        Object.keys(data).map((ability) => {
          td = td + data[ability]['damage']['damageTotal'];
          setMessage((message) => [
            ...message,
            {
              ...data[ability],
            },
          ]);
        });
        setTotalDamage(td);
      })
    );
  }, [build, god, enemyBuild, enemy]);

  useEffect(() => {
    if (god) {
      fetch('/api/getautodmgcalc/', requestOptionsAutoAttck).then((res) =>
        res.json().then((data) => {
          setMessageAA(data);
          setTotalDamageAA(data['Damage Total']);
        })
      );
    }
  }, [build, god, enemyBuild, enemy]);

  useGetBuildFetch(buildOptions, god, setCombatStats);
  useGetBuildFetch(enemyBuildOptions, enemy, setDefensiveStats);

  return (
    <div className='player-profile-page'>
      <div
        className='player-profile-container content-side-padding'
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        {/* <NameForm setPlayer={setPlayer} /> */}
        <div className='player-content-container'>
          <div className='damage-content-main'>
            <div className='player-main' style={{ width: '100%' }}>
              <div className='main-calc-wrapper'>
                <div className='god-selection-wrapper'>
                  <div className='content-section god-selection-box'>
                    <div className='content-section_header'>God Selection</div>
                    <GodSelectionBox god={god} setGod={setGod} />
                    <BuildSection
                      build={build}
                      setBuild={setBuild}
                      items={items}
                    />
                  </div>
                  <CombatStatSection combatStats={combatStats} god={god} />
                </div>
                <div className='god-selection-wrapper'>
                  <div className='content-section god-selection-box'>
                    <div className='content-section_header'>
                      Enemy Selection
                    </div>
                    <GodSelectionBox god={enemy} setGod={setEnemy} />
                    <BuildSection
                      build={enemyBuild}
                      setBuild={setEnemyBuild}
                      items={enemyItems}
                    />
                  </div>
                  <CombatStatSection combatStats={defensiveStats} god={enemy} />
                </div>
              </div>
              <div className='side-calc-wrapper god-selection-wrapper'>
                <DamageOut message={message} totalDamage={totalDamage} />
                <DamageOutAA message={messageAA} totalDamage={totalDamageAA} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
