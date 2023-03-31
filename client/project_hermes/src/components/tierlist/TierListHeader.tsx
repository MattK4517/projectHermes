import { ILastUpdate } from "../../models/tierlist/tierlist.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build";

interface ITierListHeaderProps {
  defaultParams: GodPagePropsType;
  lastUpdate: ILastUpdate;
}

const TierListHeader = ({
  defaultParams,
  lastUpdate,
}: ITierListHeaderProps) => {
  return (
    <div className="pb-10 text-white">
      <div className="flex items-center pb-5">
        <span className="mr-3 text-2xl">
          {defaultParams?.type} Tier list for {defaultParams.role},{" "}
          {defaultParams.rank}
        </span>
        <div className="hidden h-full rounded bg-card50 p-3 md:block">
          Patch {defaultParams?.patch}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center md:flex-row">
        <div className="mr-4 min-w-max flex-1 rounded-lg bg-card50 p-3">
          <div>
            <span className="font-bold">{defaultParams.type} </span>
            <span className="text-sm text-slate-500">/</span>{" "}
            <span className="text-lightBlue">Last Updated: </span>
            <span className="font-bold">{lastUpdate.lastUpdate} </span>
            <span className="text-sm text-slate-500">/</span>{" "}
            <span className="text-lightBlue">Total Games: </span>
            <span className="font-bold">
              {lastUpdate.games.toLocaleString()}
            </span>
          </div>
        </div>
        <span className="flex-1 text-sm text-lightBlue">
          Smite tierlist for the newest patch. Live updated data for the best
          analytics in Smite.
        </span>
      </div>
    </div>
  );
};

export default TierListHeader;
