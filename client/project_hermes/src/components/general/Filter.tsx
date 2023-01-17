import { Listbox } from "@headlessui/react";
import { Key, useState } from "react";

type FilterListType = {
  filterValue: string;
  defaultValue: string;
  filterOptions: {
    optionName: string;
    optionUrl?: string;
  }[];
};

interface IFilterProps {
  filterList: FilterListType;
}

const Filter = ({ filterList }: IFilterProps) => {
  const [filterValue, setFilterValue] = useState<string>(
    filterList.defaultValue
  );
  return (
    <Listbox value={filterValue} onChange={setFilterValue}>
      <Listbox.Button className="m-8 bg-red-500 p-8 text-lg">
        {filterValue}
      </Listbox.Button>
      <Listbox.Options>
        {filterList.filterOptions.map(
          (filter, index: Key | null | undefined) => {
            return (
              <Listbox.Option key={index} value={filter.optionName}>
                {filter.optionName}
              </Listbox.Option>
            );
          }
        )}
      </Listbox.Options>
    </Listbox>
  );
};

export default Filter;
