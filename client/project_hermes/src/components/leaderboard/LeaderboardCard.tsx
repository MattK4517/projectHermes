import IconName from "../general/IconName";
import {
  getRankTierColor,
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
    <div>
      <TopPlayerCard data={data[0]} />
      <div className="grid-row-4 grid grid-flow-row gap-0.5 lg:grid-flow-col lg:grid-cols-4 lg:gap-2">
        {data.slice(1).map((player, index) => (
          <TopFiveCard data={player} key={index} ranking={index + 2} />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;

const TopFiveCard = ({
  data,
  ranking,
}: {
  data: ILeaderboardPlayer;
  ranking: number;
}) => {
  return (
    <div className="card flex flex-row gap-3 p-2 lg:flex-col">
      <div className="flex flex-row items-center">
        <span
          className={`rounded-md bg-slate-800 bg-opacity-30 p-3 text-lg font-bold text-gray-600 lg:text-xl
        ${ranking === 2 ? "bg-slate-600 text-lightBlue" : ""}
        ${ranking === 3 ? "bg-amber-700 text-yellow-600" : ""}
      `}
        >
          {ranking}
        </span>
        <span className="ml-3 min-w-[75px] text-sm lg:text-base">
          {data.name || "Hidden Profile"}
        </span>
      </div>
      <div className="w-full rounded-md bg-darkBlue p-2">
        <div className="flex flex-col items-center lg:flex-row">
          <IconName
            displayIcon={RankIconLoader(normalizeTier(data.tier), "Conquest")}
            loader={ImgurLoader}
            width={24}
            height={24}
            displayName={normalizeTier(data.tier)}
            textStyling={`text-${getRankTierColor(
              normalizeTier(data.tier)
            )} font-semibold !block`}
            divStyling={"!justify-start !ml-2"}
          />
          <span className="h-fit min-w-max text-sm text-lightBlue">
            {" "}
            / {Number(data.rankedStatConq).toFixed()} MMR
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center rounded-md bg-darkBlue p-2 text-xs">
        <span className="mb-1 flex min-w-max text-white">
          <span
            style={{
              color: getWinRateColor(
                ((data.wins / data.games) * 100).toFixed(2)
              ),
            }}
          >
            {((data.wins / data.games) * 100).toFixed(2)}%
          </span>
          <span className="mx-1 text-gray-600"> / </span>
          {data.games} Games
        </span>
        <div className="h-1 w-full rounded-md bg-slate-700">
          <div
            className="h-1 rounded-md"
            style={{
              width: `${((data.wins / data.games) * 100).toFixed(2)}%`,
              backgroundColor: getWinRateColor(
                ((data.wins / data.games) * 100).toFixed(2)
              ),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const TopPlayerCard = ({ data }: { data: ILeaderboardPlayer }) => {
  return (
    <div
      className="card w-full bg-cover bg-right bg-no-repeat "
      style={{
        backgroundImage:
          "linear-gradient(to left, rgb(30 41 59 / 0.44), rgb(30 41 59 / 1)), url(https://webcdn.hirezstudios.com/smite/v3/game-modes/Conquest/01.jpg)",
      }}
    >
      <div className="flex items-center">
        <span className="rounded-md bg-amber-500 bg-opacity-30 p-5 text-3xl text-yellow-500 underline underline-offset-4">
          1
        </span>
        <div className="ml-5 flex w-fit flex-col text-white">
          <span className="text-2xl">{data.name || "Hidden Profile"}</span>
          <div className="w-full rounded-md bg-darkBlue p-1">
            <div className="flex items-center">
              <IconName
                displayIcon={RankIconLoader(
                  normalizeTier(data.tier),
                  "Conquest"
                )}
                loader={ImgurLoader}
                width={24}
                height={24}
                displayName={normalizeTier(data.tier)}
                textStyling={`text-${getRankTierColor(
                  normalizeTier(data.tier)
                )} font-semibold`}
              />
              <span className="h-fit min-w-max text-sm text-lightBlue">
                {" "}
                / {Number(data.rankedStatConq).toFixed()} MMR
              </span>
              <div className="mx-5 text-xs">
                <span className="mb-1 flex min-w-max text-white">
                  <span
                    style={{
                      color: getWinRateColor(
                        ((data.wins / data.games) * 100).toFixed(2)
                      ),
                    }}
                  >
                    {((data.wins / data.games) * 100).toFixed(2)}%
                  </span>
                  <span className="mx-1 text-gray-600"> / </span>
                  {data.games} Games
                </span>
                <div className="h-1 w-full rounded-md bg-slate-700">
                  <div
                    className="h-1 rounded-md"
                    style={{
                      width: `${((data.wins / data.games) * 100).toFixed(2)}%`,
                      backgroundColor: getWinRateColor(
                        ((data.wins / data.games) * 100).toFixed(2)
                      ),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
