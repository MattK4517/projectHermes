import { useContext, useState } from 'react';
import { TierListContext } from '../Tierlists/TierListContext';
import Filter from './Filter';

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
  const [ranks, setranks] = useState(['All Ranks']);
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
        patchFilters={[
          '10.3',
          '10.2',
          '10.1',
          '9.11',
          '9.10',
          '9.9',
          '9.8',
          '9.7',
          '9.6',
          '9.5',
          '9.4',
        ]}
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
