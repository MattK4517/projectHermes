import { useQuery } from "@tanstack/react-query";
import { Build } from "../../../models/items.model";
import { GodPagePropsType } from "../../../pages/gods/[god]/build";
import { getGodPageData } from "../../../service/gods/gods.service";
import Loading from "../../general/Loading";
import { SingleBuildDisplay } from "./SingleBuildDisplay";

interface IBuildRowProps {
  build: Build;
  defaultParams: GodPagePropsType;
}
export const BuildRow = ({ build, defaultParams }: IBuildRowProps) => {
  const { data, isLoading, isError } = useQuery(
    ["god-build", defaultParams],
    () => getGodPageData({ ...defaultParams, type: "build" })
  );
  if (data) {
    console.log(data);
    build = data;
  }
  return (
    <div className="card mt-3 grid grid-cols-3 lg:grid-cols-6">
      {isLoading ? (
        <Loading height={12} width={12} />
      ) : (
        build.items.map((item, index) => {
          return (
            <SingleBuildDisplay
              item1={item.item1}
              item2={item.item2}
              slot={index + 1}
            />
          );
        })
      )}
    </div>
  );
};
