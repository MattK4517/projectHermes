import { createContext, useState } from "react";
import { FilterListType } from "../general/Filter";

export const TierListContext = createContext<any>({
  tabs: [
    { name: "Regular Tier List", link: `tier-list`, selected: true },
    { name: "Combat Tier List", link: `combat-tier-list` },
    { name: "Objective Tier List", link: `objective-tier-list` },
    { name: "Duos Tier List", link: `duos-tier-list` },
  ],
  filterList: [],
  setFilterList: () => {
    return [];
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

export const TierListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
