import { Link } from 'react-router-dom';
import TeamDisplay from './TeamDisplay';
import HeaderMatchInfoSummary from './HeaderMatchInfoSummary';

const reducer = (accumulator, currentValue) => accumulator + currentValue;

export default function BaseMatchSummary(props) {
  return (
    <div className='match-summary-container' style={{ minWidth: '200px' }}>
      <div className='match-info-header'>
        <h3>
          {props.queueType} {props.mode} - {props.matchId}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {props.length} Minutes - {props.date}
        </div>
      </div>
      <div className='match-info-simple'>
        <TeamDisplay
          bans={props.bansWinner}
          gods={props.godsWinner}
          mmr={props.mmrWinner}
          team={'Winner'}
          carryPlayer={props.carryPlayerWinner}
          carryScore={props.carryScoreWinner}
          queueType={props.queueType}
        />
        <TeamDisplay
          bans={props.bansLoser}
          gods={props.godsLoser}
          mmr={props.mmrLoser}
          team={'Loser'}
          carryPlayer={props.carryPlayerLoser}
          carryScore={props.carryScoreLoser}
          queueType={props.queueType}
        />
      </div>
      <div
        style={{ borderBottom: '1px solid #414165', marginBottom: '16px' }}
      ></div>
      <HeaderMatchInfoSummary matchData={props.matchData} />
    </div>
  );
}
