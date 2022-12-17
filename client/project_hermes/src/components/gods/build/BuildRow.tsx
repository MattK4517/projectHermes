import { Build } from "../../../models/items.model";
import { SingleBuildDisplay } from "./SingleBuildDisplay";

export const BuildRow = ({ items, relics }: Build) => {
  return (
    <div className="card grid h-full w-full grid-cols-1 p-0 sm:grid-cols-3 md:grid-cols-2 lg:flex lg:flex-row">
      {items.map((item, index) => {
        return (
          <SingleBuildDisplay
            item1={item.item1}
            item2={item.item2}
            slot={index + 1}
          />
        );
      })}
    </div>
  );
};
