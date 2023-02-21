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
    <div className="flex">
      {filterList.map((filter, index) => {
        console.log(filter);
        return (
          <div key={index}>
            <div>{filterValue}</div>
            <Listbox value={filterValue} onChange={setFilterValue}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filter.filterOptions.map(
                      (filter, index: Key | null | undefined) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={filter.optionName}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
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
