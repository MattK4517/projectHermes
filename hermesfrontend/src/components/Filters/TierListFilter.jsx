import React, { useState, useContext } from 'react';
import FilterForm from './FilterForm';
import Filter from './Filter';
import { TierListContext } from '../Tierlists/TierListContext';

export default function TierListFilter(props) {
  const [
    god,
    setGod,
    queueType,
    setQueueType,
    patch,
    setPatch,
    rank,
    setRank,
    role,
    setRole,
    topLink,
    setTopLink,
    mode,
    setMode,
  ] = useContext(TierListContext);

  const [roles, setRoles] = useState([
    'Solo',
    'Jungle',
    'Mid',
    'Support',
    'Carry',
    'All Roles',
  ]);
  const [ranks, setranks] = useState([
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Masters',
    'Grandmaster',
    'All Ranks',
  ]);
  const modes = ['Conquest', 'Joust', 'Duel'];
  const queueTypes = ['Ranked', 'Casual'];

  return (
    <>
      <Filter
        mode={mode}
        role={role}
        god={god}
        queueType={queueType}
        rank={rank}
        patch={patch}
        matchup={'none'}
        modeFilters={modes}
        patchFilters={['9.8', '9.7', '9.6', '9.5', '9.4', '9.3', '9.2', '9.1']}
        roleFilters={roles}
        rankFilters={ranks}
        queueFilters={queueTypes}
        routes={'none'}
        setRank={setRank}
        setRole={setRole}
        setPatch={setPatch}
        setMode={setMode}
        setMatchup={'none'}
        setQueueType={setQueueType}
      />
    </>
  );
}
