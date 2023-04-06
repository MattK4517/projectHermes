import { createContext, FC, SetStateAction, useState } from "react";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "../general/Filter";
import { GenericFilterList } from "../general/GenericObejcts";

export const TierListContext = createContext<any>({
  tabs: [
    { name: "Regular Tier List", link: `tier-list`, selected: true },
    { name: "Combat Tier List", link: `combat-tier-list` },
    { name: "Objective Tier List", link: `objective-tier-list` },
    { name: "Duos Tier List", link: `duos-tier-list` },
  ],
  filterList: [],
  setFilterList: () => {},
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

  const [filterList, setFilterList] = useState<FilterListType[]>([]);

  return (
    <TierListContext.Provider value={{ tabs, filterList, setFilterList }}>
      {children}
    </TierListContext.Provider>
  );
};
