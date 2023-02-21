import { Listbox, Transition } from "@headlessui/react";
import { Fragment, Key, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";

type FilterListType = {
  filterValue: string;
  defaultValue: string;
  filterOptions: {
    optionName: string;
    optionUrl?: string;
  }[];
};

interface IFilterProps {
  filterList: FilterListType[];
}

const Filter = ({ filterList }: IFilterProps) => {
  const [filterValue, setFilterValue] = useState<string>(
    filterList[0].defaultValue
  );
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold text-white">Filters</span>
      {filterList.map((filter, index) => {
        return (
          <div key={index}>
            <Listbox value={filterValue} onChange={setFilterValue}>
              <div className="relative mt-1">
                <Listbox.Button
                  className="
                relative w-full cursor-pointer rounded-lg bg-[#161633] py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none sm:text-sm"
                >
                  <span className="block truncate">{filterValue}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <AiOutlineDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-fit overflow-y-auto rounded-md bg-[#161633] p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filter.filterOptions.map(
                      (filter, index: Key | null | undefined) => (
                        <Listbox.Option
                          key={index}
                          className={({ active, selected }) =>
                            `relative cursor-pointer select-none py-2 px-4 pl-10 text-white ${
                              active
                                ? "bg-selectedColor font-semibold"
                                : "font-normal"
                            }
                            
                             ${selected ? "bg-selectedColor" : ""}`
                          }
                          value={filter.optionName}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block ${
                                  selected ? " font-bold" : "font-normal"
                                }`}
                              >
                                {filter.optionName}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      )
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        );
      })}
    </div>
  );
};

export default Filter;

{
  /* <Listbox.Button className=" mb-8 rounded-md text-lg text-white">
        {filterValue}
      </Listbox.Button>
      <Listbox.Options>
        {filterList.filterList.map(
          (filter, index: Key | null | undefined) => {
            return (
              <Listbox.Option
                key={index}
                value={filter.optionName}
                className="cursor-pointer text-white"
              >
                {filter.optionName}
              </Listbox.Option>
            );
          }
        )}
      </Listbox.Options> */
}
