import { useState, createContext, FC, Dispatch, SetStateAction } from "react";
import { god } from "../../models/gods.model";
import { TabListType } from "../general/TabList";

type GodContextType = {
  god: god;
  setGod: Dispatch<SetStateAction<god>> | null;
  tabs: TabListType[];
};

export const GodContext = createContext<GodContextType>({
  god: "",
  setGod: null,
  tabs: [],
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

  const filterList = [
    {
      filterValue: "role",
      defaultValue: "Solo",
      filterOptions: [
        { optionName: "Solo" },
        { optionName: "Jungle" },
        { optionName: "Mid" },
        { optionName: "Carry" },
        { optionName: "Support" },
      ],
    },
    {
      filterValue: "rank",
      defaultValue: "All Ranks",
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
      ],
    },
  ];

  return (
    <GodContext.Provider value={{ god, setGod, tabs, filterList }}>
      {children}
    </GodContext.Provider>
  );
};
