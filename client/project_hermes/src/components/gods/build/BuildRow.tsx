import { Build } from "../../../models/items.model";
import { GodPagePropsType } from "../../../pages/gods/[god]/build";
import { SingleBuildDisplay } from "./SingleBuildDisplay";

interface IBuildRowProps {
  build: Build;
  defaultParams: GodPagePropsType;
}
export const BuildRow = ({ build, defaultParams }: IBuildRowProps) => {
  return (
    <div className="card mt-3 grid grid-cols-3 lg:grid-cols-6">
      {build.items.map((item, index) => {
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
