import { tier } from "../../../models/gods/gods.model";
import { getTierColor, getWinRateColor } from "../GodHelpers";

export type WinRateStatsType = {
  winRate: number;
  pickRate: number | undefined;
  banRate: number | undefined;
  games: number | undefined;
  queueType: "Ranked" | "Casual";
  tier: tier;
};

export interface IWinRateStats {
  winRateStats: WinRateStatsType;
}

const WinRateStats = ({ winRateStats }: IWinRateStats): JSX.Element => {
  let banrateMessage;
  if (winRateStats.queueType === "Ranked") {
    banrateMessage = winRateStats.banRate + "%";
  } else if (winRateStats.queueType === "Casual") {
    banrateMessage = "N/A";
  }
  return (
    <div className="card flex w-full flex-row flex-wrap justify-around px-0 sm:flex-row sm:flex-nowrap">
      {["tier", "winRate", "pickRate", "banRate", "games"].map((key) => {
        return (
          <div
            id={key}
            className={`${
              key !== "games"
                ? "sm:nav-border flex flex-shrink flex-grow flex-col items-center px-2 sm:flex-auto"
                : "flex-0 nav-border-top mt-3 flex flex-col items-center p-3 sm:mt-0 sm:flex-auto sm:border-t-0 sm:p-0"
            }`}
          >
            <div
              id="value"
              className="text-xl font-extrabold"
              style={{
                color:
                  key === "tier"
                    ? getTierColor(winRateStats.tier)
                    : "" || key === "winRate"
                    ? getWinRateColor(winRateStats.winRate)
                    : "",
              }}
            >
              {winRateStats[key]}
              {key.includes("Rate") ? "%" : ""}
            </div>
            <div id="label" className="text-base font-medium text-lighterBlue">
              {key
                .replace(/([A-Z]+)/g, " $1")
                .replace(/([A-Z][a-z])/g, " $1")
                .replace(/^./, (match) => match.toUpperCase())}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WinRateStats;
