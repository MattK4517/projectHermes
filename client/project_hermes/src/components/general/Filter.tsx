import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, Key, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { ImgurLoader, RankIconLoader } from "../loader";

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
  filter: FilterListType;
  filterList: FilterListType[];
  setFilterList: React.Dispatch<React.SetStateAction<FilterListType[]>>;
  index: number;
}

const Filter = ({ filter, index, filterList, setFilterList }: IFilterProps) => {
  const [value, setValue] = useState(filter?.defaultValue);

  return (
    <Listbox
      value={value}
      onChange={(e) => {
        setValue(e);
        filter.defaultValue = e;
        setFilterList((prevList) => [
          ...prevList.slice(0, index),
          (prevList[index] = filter),
          ...prevList.slice(index + 1),
        ]);
      }}
    >
      <div className="relative mt-1">
        <Listbox.Button
          className="
    relative w-full cursor-pointer rounded-lg bg-[#161633] py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none sm:text-sm"
        >
          <span className="block truncate">{value}</span>
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
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-40 min-w-max overflow-y-auto rounded-md bg-[#161633] text-base shadow-xl shadow-black ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filter?.filterOptions.map(
              (filter, index: Key | null | undefined) => (
                <Listbox.Option
                  key={index}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none items-center justify-center p-3 text-white ${
                      active ? "bg-selectedColor font-semibold" : "font-normal"
                    }
                
                 ${selected ? "bg-selectedColor" : ""}`
                  }
                  value={filter.optionName}
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-start">
                      {filter.optionUrl ? (
                        <Image
                          src={filter.optionUrl}
                          loader={ImgurLoader}
                          width={28}
                          height={28}
                          className="mr-2 h-7 w-7"
                          alt="Filter Icon"
                        />
                      ) : (
                        <Image
                          src={
                            RankIconLoader(
                              filter.optionName,
                              filterList[
                                filterList.findIndex(
                                  (val) => val.filterValue === "mode"
                                )
                              ]?.defaultValue
                            ) || ""
                          }
                          loader={ImgurLoader}
                          width={28}
                          height={28}
                          className="mr-2 h-7 w-7"
                          alt="Filter Icon"
                        />
                      )}
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
  );
};

export default Filter;
