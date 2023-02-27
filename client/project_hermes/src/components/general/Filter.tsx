import { Listbox, Transition } from "@headlessui/react";
import { Fragment, Key } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { GodPagePropsType } from "../../pages/gods/[god]/build";

export type FilterListType = {
  filterValue: string;
  defaultValue: string;
  enabled: boolean;
  filterOptions: {
    optionName: string;
    optionUrl?: string;
  }[];
};

interface IFilterProps {
  filterList: FilterListType[];
  setFilterList: any;
  defaultParams: GodPagePropsType;
}

const handleEnabled = (filterList: FilterListType[]) => {
  // dont show role if mode isnt conq
  // dont show rank if queueType isnt ranked
  // dont show queueType if mode is duel
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
    filterList[roleIndex].enabled = false;
  }
  if (filterList[modeIndex]?.defaultValue === "Duel") {
    filterList[queueIndex].enabled = false;
  }
  if (filterList[queueIndex]?.defaultValue !== "Ranked") {
    const rankIndex = filterList.findIndex(
      (value) => value.filterValue === "rank"
    );
    filterList[rankIndex].enabled = false;
  }
};

const Filter = ({ filterList, setFilterList, defaultParams }: IFilterProps) => {
  return (
    <div className="my-6 flex items-center gap-4 overflow-x-scroll py-2 sm:overflow-visible">
      <span className="font-semibold text-white">Filters</span>
      {filterList.map((filter, index: number) => {
        if (filter.enabled) {
          return (
            <div key={index}>
              <Listbox
                value={filterList[index]?.defaultValue}
                onChange={(e) => {
                  let newData = Object.assign([], filterList);
                  // @ts-ignore
                  newData[index] = {
                    ...filterList[index],
                    defaultValue: e,
                  };
                  handleEnabled(newData);
                  // @ts-ignore
                  defaultParams[newData[index].filterValue] = e;
                  setFilterList(newData);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className="
                relative w-full cursor-pointer rounded-lg bg-[#161633] py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none sm:text-sm"
                  >
                    <span className="block truncate">
                      {filterList[index]?.defaultValue}
                    </span>
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
                    <Listbox.Options className="absolute z-50 mt-1 max-h-60 min-w-max overflow-y-auto rounded-md bg-[#161633] text-base shadow-xl shadow-black ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filter.filterOptions.map(
                        (filter, index: Key | null | undefined) => (
                          <Listbox.Option
                            key={index}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none items-center justify-center p-3 text-white ${
                                active
                                  ? "bg-selectedColor font-semibold"
                                  : "font-normal"
                              }
                            
                             ${selected ? "bg-selectedColor" : ""}`
                            }
                            value={filter.optionName}
                          >
                            {({ selected }) => (
                              <div className="flex items-center justify-start">
                                {filter.optionUrl ? (
                                  <img
                                    src={filter.optionUrl}
                                    className="mr-2 h-7 w-7"
                                  />
                                ) : undefined}
                                <span
                                  className={`block ${
                                    selected ? " font-bold" : "font-normal"
                                  }`}
                                >
                                  {filter.optionName}
                                </span>
                              </div>
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
        }
      })}
    </div>
  );
};

export default Filter;
