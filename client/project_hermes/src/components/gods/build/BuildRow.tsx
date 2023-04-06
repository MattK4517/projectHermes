import { useQuery } from "@tanstack/react-query";
import { Build } from "../../../models/items.model";
import { SingleBuildDisplay } from "./SingleBuildDisplay";
import { useContext } from "react";
import { getGodPageData } from "../../../service/gods/gods.service";
import { getDefaultParams } from "../../general/getDefaultParams";
import { GodContext } from "../GodContext";
import { handleQueryEnabled } from "../GodHelpers";
import { GodPagePropsType } from "../../../pages/gods/[god]/build";
import Loading from "../../general/Loading";

export const BuildRow = ({
  build,
  defaultParams,
}: {
  build: Build;
  defaultParams: GodPagePropsType;
}) => {
  let { god, filterList } = useContext(GodContext);

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
