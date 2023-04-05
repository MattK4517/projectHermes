import { useContext } from "react";
import { GodContext } from "../gods/GodContext";
import Filter from "./Filter";

export type FilterListType = {
  filterValue: string;
  defaultValue: string;
  enabled: boolean;
  filterOptions: {
    optionName: string;
    optionUrl?: string;
  }[];
};

const handleEnabled = (filterList: FilterListType[]) => {
  const modeIndex = filterList.findIndex(
    (value) => value.filterValue === "mode"
  );
  const queueIndex = filterList.findIndex(
    (value) => value.filterValue === "queueType"
  );
  filterList.map((filter) => {
    filter.enabled = true;
  });
  if (filterList[modeIndex]?.defaultValue !== "Conquest") {
    const roleIndex = filterList.findIndex(
      (value) => value.filterValue === "role"
    );
    // @ts-ignore
    filterList[roleIndex].enabled = false;
  }
  if (filterList[modeIndex]?.defaultValue === "Duel") {
    // @ts-ignore
    filterList[queueIndex].enabled = false;
  }
  if (filterList[queueIndex]?.defaultValue !== "Ranked") {
    const rankIndex = filterList.findIndex(
      (value) => value.filterValue === "rank"
    );
    // @ts-ignore
    filterList[rankIndex].enabled = false;
  }
};

const FilterListContainer = () => {
  const { filterList, setFilterList } = useContext(GodContext);
  return (
    <div className="my-6 flex items-center gap-4 overflow-x-scroll py-2 sm:overflow-visible">
      <span className="hidden font-semibold text-white sm:block">Filters</span>
      {filterList.map((filter, index: number) => {
        if (filter.enabled) {
          return (
            <Filter
              filter={filter}
              key={index}
              filterList={filterList}
              setFilterList={setFilterList}
              index={index}
            />
          );
        }
      })}
    </div>
  );
};

export default FilterListContainer;
