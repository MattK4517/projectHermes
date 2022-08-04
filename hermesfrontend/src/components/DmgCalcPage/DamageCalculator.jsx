import React, { useState, useEffect, useContext } from 'react';
import ItemBuffs from './ItemBuffs';
import DragDropGodList, { DragDropItemList } from './DragDropGodList';
import MainCalcSection from './MainCalcSection';
import { DamageContext } from './DamageContext';
import CombatStatSection from './CombatStatSection';
import { calcBuildStats } from '../Match';
import { physGods, magGods, physicalItems, magicalItems } from '../constants';
import DamageOut, { DamageOutAA } from './DamageOut';

export default function DamageCalculator() {
  const [
    drop,
    allgods,
    board,
    setBoard,
    god,
    setGod,
    build,
    setBuild,
    dropItem,
    itemType,
    setItemType,
  ] = useContext(DamageContext);
  const [levels, setLevels] = useState({
    1: 5,
    2: 5,
    3: 5,
    4: 5,
    5: 5,
  });
  let td = 0;
  const [power, setPower] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [totalDamage, setTotalDamage] = useState(0);
  const [message, setMessage] = useState([]);
  const [totalDamageAA, setTotalDamageAA] = useState(0);
  const [messageAA, setMessageAA] = useState([]);
  const [items, setItems] = useState([]);
  const [combatStats, setCombatStats] = useState({});

  const requestOptionsAutoAttck = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      god: god,
      build: [...build],
    }),
  };
  const buildOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      god: god,
      levels: levels,
      build: [...build],
    }),
  };

  useEffect(() => {
    setBuild([]);
    setItems([]);
    setItems(() => {
      if (physGods.indexOf(god) !== -1) {
        setItemType('Physical');
        return [...physicalItems];
      } else {
        setItemType('Magical');
        return [...magicalItems];
      }
    });
  }, [god]);

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
  }, [power, god]);

  useEffect(() => {
    if (god) {
      fetch('/api/getautodmgcalc/', requestOptionsAutoAttck).then((res) =>
        res.json().then((data) => {
          setMessageAA(data);
          setTotalDamageAA(data['Damage Total']);
        })
      );
    }
  }, [power, god]);

  useEffect(() => {
    fetch('/api/getbuildstats/', buildOptions).then((res) =>
      res.json().then((data) => {
        let stats = { ...calcBuildStats(data['build'], data['base']) };
        setCombatStats((combatStats) => {
          return stats;
        });
        setPower((power) => {
          if (physGods.indexOf(god) !== -1) {
            return stats['physPower'];
          } else if (magGods.indexOf(god) !== -1) {
            return stats['magPower'];
          }
        });
      })
    );
  }, [build, god]);

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
              <MainCalcSection />
              <br></br>
              <DamageOut message={message} totalDamage={totalDamage} />
              <DamageOutAA message={messageAA} totalDamage={totalDamageAA} />
            </div>
            <div className='player-side'>
              <CombatStatSection combatStats={combatStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
