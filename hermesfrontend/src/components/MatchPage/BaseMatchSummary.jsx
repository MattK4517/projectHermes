import { Link } from 'react-router-dom';
import TeamDisplay from './TeamDisplay';
import HeaderMatchInfoSUmmary from './HeaderMatchInfoSummary';

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
        <HeaderMatchInfoSUmmary matchData={props.matchData} />
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
    </div>
  );
}
