import { useContext } from "react";
import { GodContextType } from "../gods/GodContext";
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

const FilterListContainer = ({
  context,
}: {
  context: React.Context<GodContextType>;
}) => {
  const { filterList, setFilterList } = useContext(context);
  return (
    <div className="my-6 flex items-center gap-4 overflow-x-scroll py-2 sm:overflow-visible">
      <span className="hidden font-semibold text-white sm:block">Filters</span>
      {filterList.map((filter: FilterListType, index: number) => {
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
