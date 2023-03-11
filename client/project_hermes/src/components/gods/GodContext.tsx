import { useState, createContext, FC, Dispatch, SetStateAction } from "react";
import { god } from "../../models/gods.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "../general/Filter";
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
    {
      filterValue: "role",
      defaultValue: "Solo",
      enabled: true,
      filterOptions: [
        { optionName: "Carry", optionUrl: "https://i.imgur.com/RlRTbrA.png" },
        { optionName: "Mid", optionUrl: "https://i.imgur.com/0oQkAAZ.png" },
        { optionName: "Jungle", optionUrl: "https://i.imgur.com/CyXnzEO.png" },
        { optionName: "Solo", optionUrl: "https://i.imgur.com/WLU0Cel.png" },
        { optionName: "Support", optionUrl: "https://i.imgur.com/l7CD2QM.png" },
      ],
    },
    {
      filterValue: "rank",
      defaultValue: "All Ranks",
      enabled: true,
      filterOptions: [
        { optionName: "Bronze" },
        { optionName: "Silver" },
        { optionName: "Gold" },
        { optionName: "Platinum" },
        { optionName: "Platinum+" },
        { optionName: "Diamond" },
        { optionName: "Diamond+" },
        { optionName: "Masters" },
        { optionName: "Grandmaster" },
        { optionName: "All Ranks" },
      ],
    },
    {
      filterValue: "patch",
      defaultValue: "10.2",
      enabled: true,
      filterOptions: [{ optionName: "10.1" }, { optionName: "10.2" }],
    },
    {
      filterValue: "queueType",
      defaultValue: "Ranked",
      enabled: true,
      filterOptions: [{ optionName: "Casual" }, { optionName: "Ranked" }],
    },
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
