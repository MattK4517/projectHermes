import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Build } from "../../../models/items.model";
import { GodPagePropsType } from "../../../pages/gods/[god]/build/[role]";
import { getGodPageData } from "../../../service/gods/gods.service";
import Loading from "../../general/Loading";
import { getDefaultParams } from "../../general/getDefaultParams";
import { GodContext } from "../GodContext";
import { handleQueryEnabled } from "../GodHelpers";
import { SingleBuildDisplay } from "./SingleBuildDisplay";

export const BuildRow = ({
  build,
  defaultParams,
}: {
  build: Build;
  defaultParams: GodPagePropsType;
}) => {
  const { god, filterList } = useContext(GodContext);

  const { data, isFetching } = useQuery(
    ["god-build", getDefaultParams(filterList, god)],
    () =>
      getGodPageData({
        ...getDefaultParams(filterList, god),
        type: "build",
      }),
    {
      // enable query if new filterlist is different from default Params
      // goal is to not query on mount but after filter changes
      enabled: handleQueryEnabled(defaultParams, filterList),
    }
  );

  if (data) build = data;

  return (
    <div className="card mt-3 grid grid-cols-3 lg:grid-cols-6">
      {isFetching ? (
        <Loading width={12} height={12} />
      ) : (
        build.items.map((item, index) => {
          console.log("ITEM", item);
          return (
            <SingleBuildDisplay
              key={index}
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
