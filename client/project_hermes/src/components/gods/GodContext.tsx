import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { god } from "../../models/gods/gods.model";
import { FilterListType } from "../general/Filter";
import { TabListType } from "../general/TabList";

type GodContextType = {
  god: god;
  setGod: Dispatch<SetStateAction<god>>;
  tabs: TabListType[];
  filterList: FilterListType[];
  setFilterList: Dispatch<SetStateAction<FilterListType[]>>;
};

export const GodContext = createContext<GodContextType>({
  god: "",
  setGod: () => {},
  tabs: [],
  filterList: [],
  setFilterList: () => {},
});

export const GodProvider: FC = ({ children }) => {
  const [god, setGod] = useState<god>("");
  const tabs = [
    { name: "Build", link: `build`, selected: true },
    { name: "Items", link: `items` },
    { name: "Build Paths", link: `build-paths` },
    { name: "Matchups", link: `matchups` },
    { name: "Skins", link: `skins` },
  ];

  const [filterList, setFilterList] = useState<FilterListType[]>([]);

  return (
    <GodContext.Provider
      value={{ god, setGod, tabs, filterList, setFilterList }}
    >
      {children}
    </GodContext.Provider>
  );
};
