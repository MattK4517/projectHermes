import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { linkDict } from "../../pages/gods/[god]";
import SearchBarResults from "./SearchBarResults";
export default function SearchBar() {
  const people = Object.keys(linkDict);
  const [selectedPerson, setSelectedPerson] = useState();
  const [query, setQuery] = useState("");

  const filteredGod =
    query === ""
      ? people
      : people.filter((person) => {
          return person.toLowerCase().includes(query.toLowerCase());
        });

  const sections = ["Build", "Items", "Build Paths", "Player Profile"];

  return (
    <div className="w-full">
      <Combobox value={selectedPerson} onChange={setSelectedPerson}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-card text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none bg-card50 py-2 pl-3 pr-10 text-sm leading-5 text-white focus:ring-0"
              displayValue={selectedPerson}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center fill-white pr-2">
              <HiMagnifyingGlass width={48} height={48} />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-96 w-full overflow-auto rounded-md bg-darkBlue py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {query === "NOTHING" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-white">
                  Nothing found.
                </div>
              ) : (
                sections.map((section, index) => (
                  <div key={index}>
                    <SearchBarResults
                      filteredGod={
                        section !== "Player Profile" ? filteredGod : [query]
                      }
                      section={section}
                    />
                  </div>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
