import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { tier } from "../../../models/gods/gods.model";
import { GodPagePropsType } from "../../../pages/gods/[god]/build/[role]";
import { getGodPageData } from "../../../service/gods/gods.service";
import Loading from "../../general/Loading";
import { getDefaultParams } from "../../general/getDefaultParams";
import { GodContext } from "../GodContext";
import {
  getTierColor,
  getWinRateColor,
  handleQueryEnabled,
} from "../GodHelpers";

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
  defaultParams: GodPagePropsType;
}

const WinRateStats = ({
  winRateStats,
  defaultParams,
}: IWinRateStats): JSX.Element => {
  const { god, filterList } = useContext(GodContext);
  const { data, isFetching } = useQuery(
    ["god-winrate", getDefaultParams(filterList, god)],
    () =>
      // @ts-expect-error get default params returns correctly, just reducing the filterlist array is weird with typing
      getGodPageData({
        ...getDefaultParams(filterList, god),
        type: "main",
      }),
    {
      // enable query if new filterlist is different from default Params
      // goal is to not query on mount but after filter changes
      enabled: handleQueryEnabled(defaultParams, filterList),
    }
  );

  if (data) winRateStats = data;

  // let banrateMessage;
  // if (winRateStats.queueType === "Ranked") {
  //   banrateMessage = winRateStats.banRate + "%";
  // } else if (winRateStats.queueType === "Casual") {
  //   banrateMessage = "N/A";
  // }
  return (
    <div className="card flex w-full flex-row flex-wrap justify-around px-0 sm:flex-row sm:flex-nowrap">
      {isFetching ? (
        <Loading width={12} height={12} />
      ) : (
        ["tier", "winRate", "pickRate", "banRate", "games"].map((key) => {
          return (
            <div
              key={key}
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
              <div
                id="label"
                className="text-base font-medium text-lighterBlue"
              >
                {key
                  .replace(/([A-Z]+)/g, " $1")
                  .replace(/([A-Z][a-z])/g, " $1")
                  .replace(/^./, (match) => match.toUpperCase())}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default WinRateStats;
