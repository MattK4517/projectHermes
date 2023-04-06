import { info } from "console";
import IconName from "../general/IconName";
import {
  getRankTierColor,
  getTierColor,
  getWinRateColor,
  normalizeTier,
} from "../gods/GodHelpers";
import { ImgurLoader, RankIconLoader } from "../loader";

export interface ILeaderboardPlayer {
  losses: number;
  name: string;
  points: number;
  rankedStatConq: number;
  tier: string;
  wins: number;
  id: string;
}

const LeaderboardCard = ({ data }: { data: ILeaderboardPlayer[] }) => {
  return (
    <div className="card w-full">
      <div className="flex items-center">
        <span className="rounded-md bg-amber-500 bg-opacity-30 p-5 text-3xl text-yellow-500 underline underline-offset-4">
          1
        </span>
        <div className="ml-5 flex w-fit flex-col text-white">
          <span className="text-2xl">{data[0].name || "Hidden Profile"}</span>
          <div className="w-full rounded-md bg-darkBlue p-1">
            <div className="flex items-center">
              <IconName
                displayIcon={RankIconLoader(
                  normalizeTier(data[0].tier),
                  "Conquest"
                )}
                loader={ImgurLoader}
                width={24}
                height={24}
                displayName={normalizeTier(data[0].tier)}
                textStyling={`text-${getRankTierColor(
                  normalizeTier(data[0].tier)
                )} font-semibold`}
              />
              <span className="h-fit min-w-max text-sm text-lightBlue">
                {" "}
                / {Number(data[0]?.rankedStatConq).toFixed()} MMR
              </span>
              <div className="mx-5 text-xs">
                <span className="mb-1 flex min-w-max text-white">
                  <span
                    style={{
                      color: getWinRateColor(
                        ((data[0].wins / data[0].games) * 100).toFixed(2)
                      ),
                    }}
                  >
                    {((data[0].wins / data[0].games) * 100).toFixed(2)}%
                  </span>
                  / {data[0].games} Games
                </span>
                <div className="h-1 w-full rounded-md bg-slate-700">
                  <div
                    className="h-1 rounded-md"
                    style={{
                      width: `${((data[0].wins / data[0].games) * 100).toFixed(
                        2
                      )}%`,
                      backgroundColor: getWinRateColor(
                        ((data[0].wins / data[0].games) * 100).toFixed(2)
                      ),
                    }}
                  ></div>
                </div>
                {/* info.renderValue()?.toLocaleString() */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
