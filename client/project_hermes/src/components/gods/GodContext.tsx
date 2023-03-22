import { useState, createContext, FC, Dispatch, SetStateAction } from "react";
import { god } from "../../models/gods.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "../general/Filter";
import { GenericFilterList } from "../general/GenericObejcts";
import { TabListType } from "../general/TabList";

type GodContextType = {
  god: god;
  setGod: Dispatch<SetStateAction<god>>;
  tabs: TabListType[];
  filterList: FilterListType[];
  setFilterList: Dispatch<SetStateAction<FilterListType[]>>;
  defaultParmas: GodPagePropsType;
};

export const GodContext = createContext<GodContextType>({
  god: "",
  setGod: function (value: SetStateAction<god>): void {
    throw new Error("Function not implemented.");
  },
  tabs: [],
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

export const GodProvider: FC = ({ children }) => {
  const [god, setGod] = useState<god>("");
  const tabs = [
    { name: "Build", link: `build`, selected: true },
    { name: "Items", link: `items` },
    { name: "Build Paths", link: `build-paths` },
    { name: "Matchups", link: `matchups` },
    { name: "Skins", link: `skins` },
  ];

  const [filterList, setFilterList] = useState<FilterListType[]>([
    ...GenericFilterList,
    {
      filterValue: "mode",
      defaultValue: "Conquest",
      enabled: true,
      filterOptions: [
        { optionName: "Duel", optionUrl: "https://i.imgur.com/KsoBoLs.png" },
        {
          optionName: "Conquest",
          optionUrl: "https://i.imgur.com/tydY7sr.png",
        },
        { optionName: "Joust", optionUrl: "https://i.imgur.com/LVbUJes.png" },
      ],
    },
  ]);

  let defaultParams: GodPagePropsType;

  return (
    <GodContext.Provider
      value={{ god, setGod, tabs, filterList, setFilterList, defaultParams }}
    >
      {children}
    </GodContext.Provider>
  );
};
