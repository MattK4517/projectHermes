import { createContext, FC, SetStateAction, useState } from "react";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "../general/Filter";
import { GenericFilterList } from "../general/GenericObejcts";

export const TierListContext = createContext<any>({
  tabs: [
    { name: "Tier List", link: `tier-list`, selected: true },
    { name: "Combat Tier List", link: `combat-tier-list` },
    { name: "Objective Tier List", link: `objective-tier-list` },
    { name: "Duos Tier List", link: `duos-tier-list` },
  ],
  filterList: [],
  setFilterList: function (value: SetStateAction<FilterListType[]>): void {
    throw new Error("Function not implemented.");
  },
  defaultParmas: {
    god: "",
    role: "",
    rank: "",
    patch: "",
    queueType: "",
    mode: "",
  },
});

export const TierListProvider: FC = ({ children }) => {
  const tabs = [
    { name: "Tier List", link: `tier-list`, selected: true },
    { name: "Combat Tier List", link: `combat-tier-list` },
    { name: "Objective Tier List", link: `objective-tier-list` },
    { name: "Duos Tier List", link: `duos-tier-list` },
  ];

  const [filterList, setFilterList] = useState<FilterListType[]>([
    ...GenericFilterList,
    {
      filterValue: "listType",
      defaultValue: "Regular",
      enabled: true,
      filterOptions: [
        { optionName: "Combat" },
        {
          optionName: "Objective",
        },
        { optionName: "Duos" },
      ],
    },
  ]);

  let defaultParams: GodPagePropsType;

  return (
    <TierListContext.Provider
      value={{ tabs, filterList, setFilterList, defaultParams }}
    >
      {children}
    </TierListContext.Provider>
  );
};
