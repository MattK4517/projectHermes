import { match } from "assert";
import { god } from "../../../models/gods/gods.model";
import SingleMatchupDisplay from "./SingleMatchupDisplay";

export type MatchupRowType = {
    [matchup in god]: {
        enemy: string;
        games: number;
        winRate: number;
        wins: number;
    }
};

export interface IMatchupRowProps {
    matchups: MatchupRowType
}

const MatchupRow = ({matchups}: IMatchupRowProps) => {
    Object.values(matchups).sort((matchupA, matchupB) => {
        if (matchupA.winRate > matchupB.winRate) return 1
        if (matchupA.winRate < matchupB.winRate) return -1
        return 0
    })
    return (
        <div className='card'>
            <div id="matchup-list" className="flex gap-4 overflow-x-scroll pb-2.5">
            {Object.values(matchups)
                .sort((matchupA, matchupB) => {
                    if (matchupA.winRate > matchupB.winRate) return 1
                    if (matchupA.winRate < matchupB.winRate) return -1
                    return 0
                })
                .map((matchup, index) => {
                    // if (index < 10)
                     return <SingleMatchupDisplay matchup={matchup} key={index}/>
                })
            }
            </div>
        </div>
    )
}

export default MatchupRow;