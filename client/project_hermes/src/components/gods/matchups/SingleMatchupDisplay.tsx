import Link from "next/link";
import { getWinRateColor } from "../GodHelpers";


export type MatchupDisplayType ={
    enemy: string;
    games: number;
    winRate: number;
    wins: number;
}
export interface IMatchupDisplayProps {
    matchup: MatchupDisplayType
}

const SingleMatchupDisplay = ({matchup}: IMatchupDisplayProps) =>{
    return(
        <Link
            href={`/gods/${matchup.enemy}/build`}
            target='_blank'
        >
            <div id="god-matchup" className="flex flex-col justify-center items-center min-w-20 p-1.5 rounded bg-darkBackGroundColor text-white text-center">
            <div id="god-icon-wrapper">
                <img
                    className="god-icon cursor-pointer"
                    src={`https://webcdn.hirezstudios.com/smite/god-icons/${matchup.enemy
                    .replaceAll("'", '')
                    .replaceAll(' ', '-')
                    .toLowerCase()}.jpg`}
                    alt={`${matchup.enemy} icon`}
                />
            </div>
            <div id='god-name' className="nav-border-bottom god-name">{matchup.enemy}</div>
            <div id='matchup-stats'>
                <div
                id='win-rate'
                className="text-sm font-semibold "
                style={{color: getWinRateColor(matchup.winRate)}}
                >
                {matchup.winRate || '0'}%
                </div>
                <div id='times-played' className="text-xs">{matchup.games} Matches</div>
            </div>
            </div>
        </Link>
    )
}

export default SingleMatchupDisplay;