import { god } from "../../../models/gods/gods.model";
import Loading from "../../general/Loading";
import SingleMatchupDisplay from "./SingleMatchupDisplay";

export type MatchupRowType = {
  [matchup in god]: {
    enemy: string;
    games: number;
    winRate: number;
    wins: number;
  };
};

export interface IMatchupRowProps {
  matchups: MatchupRowType;
  god: god;
  role: string;
  displayType: "counters" | "countered";
}

const MatchupRow = ({ matchups, god, role, displayType }: IMatchupRowProps) => {
  const isLoading = false;
  return (
    <div className="card">
      <div className="card-header">
        {displayType === "countered" ? "Toughest" : "Best"} Matchups{" "}
        <span className="pl-8 text-gray-600">
          These matchups{" "}
          {displayType === "countered" ? "counter" : "are countered by"} {god}{" "}
          {role}
        </span>
      </div>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loading width={12} height={12} />
        </div>
      ) : (
        <div id="matchup-list" className="flex gap-4 overflow-x-auto pb-2.5">
          {Object.values(matchups)
            .sort((matchupA, matchupB) => {
              if (matchupA.winRate > matchupB.winRate) return 1;
              if (matchupA.winRate < matchupB.winRate) return -1;
              return 0;
            })
            .map((matchup, index) => {
              if (
                index < 10 &&
                matchup.winRate < 50 &&
                displayType === "countered"
              ) {
                return <SingleMatchupDisplay matchup={matchup} key={index} />;
              } else if (
                Object.values(matchups).length - index <= 10 &&
                matchup.winRate > 50 &&
                displayType === "counters"
              ) {
                return <SingleMatchupDisplay matchup={matchup} key={index} />;
              }
            })}
        </div>
      )}
    </div>
  );
};

export default MatchupRow;
