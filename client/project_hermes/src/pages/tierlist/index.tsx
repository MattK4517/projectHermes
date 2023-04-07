import { useContext, useEffect } from "react";
import FilterListContainer from "../../components/general/FilterList";
import TabList from "../../components/general/TabList";
import { TierListContext } from "../../components/tierlist/TierListContext";
import TierListHeader from "../../components/tierlist/TierListHeader";
import { ILastUpdate } from "../../models/tierlist/tierlist.model";
import { GodPagePropsType } from "../gods/[god]/build/[role]";

function TierIndex() {
  return <div></div>;
}

export default TierIndex;

const TierListLayout = ({
  children,
  defaultParams,
  lastUpdate,
}: {
  children: React.ReactNode;
  defaultParams: GodPagePropsType;
  lastUpdate: ILastUpdate;
}) => {
  const { tabs, filterList, setFilterList } = useContext(TierListContext);
  let tempFilterList = [
    {
      filterValue: "role",
      defaultValue: "All Roles",
      enabled: true,
      filterOptions: [
        { optionName: "Carry", optionUrl: "https://i.imgur.com/RlRTbrA.png" },
        { optionName: "Mid", optionUrl: "https://i.imgur.com/0oQkAAZ.png" },
        { optionName: "Jungle", optionUrl: "https://i.imgur.com/CyXnzEO.png" },
        { optionName: "Solo", optionUrl: "https://i.imgur.com/WLU0Cel.png" },
        { optionName: "Support", optionUrl: "https://i.imgur.com/l7CD2QM.png" },
        { optionName: "All Roles" },
      ],
    },
    {
      filterValue: "patch",
      defaultValue: "10.3",
      enabled: true,
      filterOptions: [
        { optionName: "10.1" },
        { optionName: "10.2" },
        { optionName: "10.3" },
      ],
    },
    {
      filterValue: "queueType",
      defaultValue: "Ranked",
      enabled: true,
      filterOptions: [{ optionName: "Casual" }, { optionName: "Ranked" }],
    },
  ];
  tempFilterList = tempFilterList.map((filter) => {
    return {
      ...filter,
      defaultValue: defaultParams[filter.filterValue as keyof GodPagePropsType],
    };
  });

  useEffect(() => {
    setFilterList(tempFilterList);
  }, []);

  return (
    <div id="god-profile-main-page" className="mx-auto flex w-full">
      <div
        id="god-profile-content-container content-side-padding"
        className="w-full sm:px-3"
      >
        <div
          id="god-profile-container page_build"
          className="background-image w-full"
          //   style={{
          //     backgroundImage: `radial-gradient(400px 200px at 60% 34%, rgba(7, 7, 32, 0) 0%, rgb(7, 7, 32) 100%),
          // linear-gradient(90deg, rgb(7, 7, 32) 0%, rgba(7, 7, 32, 0.6) 100%), url(${url})`,
          //   }}
        >
          <div className="pb-5">
            <TierListHeader
              defaultParams={defaultParams}
              lastUpdate={lastUpdate}
            />
            <TabList {...tabs} />
            <FilterListContainer context={TierListContext} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export { TierListLayout };
