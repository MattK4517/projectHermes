import React from "react"

export interface WinRateStatsType {
    winRate: number | undefined;
    pickRate: number | undefined;
    banRate: number | undefined;
    matches: number | undefined;
    queueType: 'Ranked' | 'Casual'
}

 const WinRateStats = (props: WinRateStatsType): JSX.Element => {
    let banrateMessage;
    if (props.queueType === 'Ranked') {
      banrateMessage = props.banRate + '%';
    } else if (props.queueType === 'Casual') {
      banrateMessage = 'N/A';
    }
    return (
        <div className='card flex flex-row'>
        <div className='win-rate'>
          <div className='value'>
            {props.winRate}%
          </div>
          <div className='label'>Win Rate</div>
        </div>
  
        <div className='pick-rate'>
          <div className='value'>{props.pickRate}%</div>
          <div className='label'>Pick Rate</div>
        </div>
  
        <div className='ban-rate'>
          <div className='value'>{banrateMessage}</div>
          <div className='label'>Ban Rate</div>
        </div>
  
        <div className='matches'>
          <div className='value'>{props.matches}</div>
          <div className='label'>Matches</div>
        </div>
      </div>
    )
}

export default WinRateStats