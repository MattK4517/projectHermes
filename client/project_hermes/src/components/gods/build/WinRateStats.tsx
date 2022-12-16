import React from "react"
import { tier } from "../../../models/gods/gods.model";
import { getWinRateColor, getTierColor } from "../GodHelpers";

export type WinRateStatsType = {
    winRate: number;
    pickRate: number | undefined;
    banRate: number | undefined;
    games: number | undefined;
    queueType: 'Ranked' | 'Casual'
    tier: tier
}

export interface IWinRateStats {
  winRateStats: WinRateStatsType
}



 const WinRateStats = ({winRateStats}: IWinRateStats): JSX.Element => {
    let banrateMessage;
    if (winRateStats.queueType === 'Ranked') {
      banrateMessage = winRateStats.banRate + '%';
    } else if (winRateStats.queueType === 'Casual') {
      banrateMessage = 'N/A';
    }
    return (
      
        <div className='card flex flex-row px-0 w-full'>
        <div id='tier' className="flex-1 flex flex-col items-center nav-border">
          <div id='value' className="text-xl font-extrabold" style={{color: getTierColor(winRateStats.tier)}}>
            {winRateStats.tier}
          </div>
          <div id='label' className="text-base font-medium text-lighterBlue">Tier</div>
        </div>
        <div id='win-rate' className="flex-1 flex flex-col items-center nav-border">
          <div id='value' className="text-xl font-extrabold" style={{color: getWinRateColor(winRateStats.winRate)}}>
            {winRateStats.winRate}%
          </div>
          <div id='label' className="text-base font-medium text-lighterBlue">Win Rate</div>
        </div>
  
        <div id='pick-rate' className="flex-1 flex flex-col items-center nav-border">
        <div id='value' className="text-xl font-extrabold">{winRateStats.pickRate}%</div>
          <div id='label' className="text-base font-medium text-lighterBlue">Pick Rate</div>
        </div>
  
        <div id='ban-rate' className="flex-1 flex flex-col items-center nav-border">
        <div id='value' className="text-xl font-extrabold">{banrateMessage}</div>
          <div id='label' className="text-base font-medium text-lighterBlue">Ban Rate</div>
        </div>

        <div id='matches' className="flex-1 flex flex-col items-center">
        <div id='value' className="text-xl font-extrabold">{winRateStats.games}</div>
          <div id='label' className="text-base font-medium text-lighterBlue">Matches</div>
        </div>
      </div>
    )
}

export default WinRateStats