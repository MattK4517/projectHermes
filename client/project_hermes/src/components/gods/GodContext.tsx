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

  return (
    <GodContext.Provider value={{ god, setGod, tabs }}>
      {children}
    </GodContext.Provider>
  );
};
