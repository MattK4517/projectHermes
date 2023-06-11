import Image from "next/image";
import Link from "next/link";
import GodIconLoader from "../../loader";
import { getWinRateColor, normalizeGodName } from "../GodHelpers";

export type MatchupDisplayType = {
  enemy: string;
  games: number;
  winRate: number;
  wins: number;
};

const SingleMatchupDisplay = ({ matchup }: { matchup: MatchupDisplayType }) => {
  return (
    <Link
      href={`/gods/${normalizeGodName(matchup.enemy)}/build`}
      target="_blank"
    >
      <div
        id="god-matchup"
        className="flex cursor-pointer flex-col items-center justify-center rounded bg-darkBackGroundColor p-1.5 text-center text-white hover:bg-mainBackGroundColor"
        style={{ minWidth: "75px" }}
      >
        <div id="god-icon-wrapper">
          <Image
            className="god-icon"
            loader={GodIconLoader}
            src={matchup.enemy}
            width={36}
            height={36}
            alt={`${matchup.enemy} icon`}
          />
        </div>
        <div id="god-name" className="god-name">
          {matchup.enemy}
        </div>
        <hr className="nav-border my-2.5 w-full border-borderColor" />
        <div id="matchup-stats">
          <div
            id="win-rate"
            className="text-sm font-semibold"
            style={{
              color: getWinRateColor(matchup.winRate),
              fontSize: "12px",
            }}
          >
            {matchup.winRate || "0"}%
          </div>
          <div
            id="times-played"
            className=" text-lightBlue"
            style={{ lineHeight: "1.35", fontWeight: "400", fontSize: "10px" }}
          >
            {matchup.games} Matches
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SingleMatchupDisplay;
