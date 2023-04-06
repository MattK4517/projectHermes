import { Combobox } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import GodIconLoader from "../loader";

const SearchBarResults = ({
  filteredGod,
  section,
}: {
  filteredGod: string[];
  section: string;
}) => {
  return (
    <div>
      <div className="bg-card50 p-2 text-lightBlue">{section}</div>
      {filteredGod.map((god, index) => (
        <Combobox.Option
          key={index}
          className={({ active }) =>
            `relative cursor-default select-none py-2 pl-2 pr-4 text-white ${
              active ? "bg-darkBackGroundColor" : ""
            }`
          }
          value={god}
        >
          {({ selected, active }) => (
            <Link
              key={index}
              href={
                section !== "Player Profile"
                  ? `/gods/${god}/${section.toLowerCase().replaceAll(" ", "-")}`
                  : `/players/${god}`
              }
              className="m-1 flex w-full items-center justify-start"
            >
              <Image
                src={god}
                loader={GodIconLoader}
                width={36}
                height={36}
                className={"rounded-md border-2 border-yellow-800"}
                alt={`${god} icon`}
              />
              <span
                className=" ml-5 max-w-max text-sm sm:max-w-fit lg:block"
                style={{ whiteSpace: "initial" }}
              >
                {god}
              </span>
            </Link>
          )}
        </Combobox.Option>
      ))}
    </div>
  );
};

export default SearchBarResults;
