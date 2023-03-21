import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import {
  AiFillHome,
  AiFillMail,
  AiFillShop,
  AiFillTrophy,
  AiOutlineBars,
  AiOutlineDown,
} from "react-icons/ai";
import { GiPikeman, GiSwordClash, GiSwordman } from "react-icons/gi";

const LargeNav = ({
  open,
  setShowText,
  route,
  setOpen,
}: {
  open: boolean;
  setShowText: any;
  route: string;
  setOpen: any;
}) => {
  const iconStyling = `w-8 h-8 opacity-100`;

  const iconBoxStyling = (text: string) => {
    return `mb-10 flex cursor-pointer flex-row items-center hover:text-white rounded-md ${
      route.split("/")[1]?.toLowerCase() === text.toLowerCase()
        ? "rounded shadow-2xl text-white hover:text-white"
        : ""
    } ${
      route.split("/")[1]?.toLowerCase() === text.toLowerCase() && open
        ? "bg-winnerColor text-white"
        : ""
    }
    ${
      route.split("/")[1]?.toLowerCase() !== text.toLowerCase() && open
        ? "hover:bg-blue-600"
        : ""
    }`;
  };

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTransitionEndCapture={() => setShowText(false)}
      onTransitionEnd={() => setShowText(true)}
      className={` nav-border duration-30 hidden h-full overflow-x-hidden bg-card px-4 py-4 text-fontAlt transition-[width] lg:block ${
        !open ? "w-16" : "w-52"
      }`}
    >
      {[
        "Tierlist",
        "Gods",
        "Contact",
        "Find A Match",
        "Leaderboard",
        "Items",
      ].map((text: string, index: number) => {
        let newRoute = text;
        let icon;

        if (text === "Home") {
          newRoute = "";
          icon = <AiFillHome className={iconStyling} />;
        } else if (text === "Gods") {
          icon = <GiPikeman className={iconStyling} />;
        } else if (text === "Tierlist") {
          return (
            <Disclosure>
              <Link key={index} href={"/".concat(newRoute.toLowerCase())}>
                <div className={iconBoxStyling(text)}>
                  <div
                    className={` p-1 ${
                      route.split("/")[1]?.toLowerCase() === text.toLowerCase()
                        ? "rounded bg-winnerColor "
                        : ""
                    }`}
                  >
                    <AiOutlineBars className={iconStyling} />
                  </div>
                  <div className={`flex`}>
                    <span className={`relative ml-4 whitespace-nowrap`}>
                      {text}{" "}
                    </span>
                    <Disclosure.Button className="ml-2 flex items-center justify-center">
                      <AiOutlineDown />
                    </Disclosure.Button>
                  </div>
                </div>
              </Link>
              <Disclosure.Panel
                className={`relative ml-4 mb-10 flex flex-col gap-5 whitespace-nowrap ${
                  !open ? "hidden" : ""
                }`}
              >
                {[
                  "Regular Tier List",
                  "Combat Tier List",
                  "Objective Tier List",
                  "Duos Tier List",
                ].map((tierListType: string, index) => {
                  return (
                    <Link
                      key={index}
                      href={"/tierlist/".concat(
                        tierListType.toLowerCase().split(" ")[0] || ""
                      )}
                    >
                      <div className="cursor-pointer hover:text-[#3273fa]">
                        {tierListType}
                      </div>
                    </Link>
                  );
                })}
              </Disclosure.Panel>
            </Disclosure>
          );
        } else if (text === "Contact") {
          icon = <AiFillMail className={iconStyling} />;
        } else if (text === "Find A Match") {
          icon = <GiSwordClash className={iconStyling} />;
        } else if (text === "Damage Calculator") {
          icon = <GiSwordman className={iconStyling} />;
        } else if (text === "Leaderboard") {
          icon = <AiFillTrophy className={iconStyling} />;
        } else if (text === "Items") {
          icon = <AiFillShop className={iconStyling} />;
        } else {
          newRoute = text;
        }
        return (
          <Link key={index} href={"/".concat(newRoute.toLowerCase())}>
            <div className={iconBoxStyling(text)}>
              <div
                className={` p-1 ${
                  route.split("/")[1]?.toLowerCase() === text.toLowerCase()
                    ? "rounded bg-winnerColor "
                    : ""
                }`}
              >
                {icon}
              </div>
              <p className={`relative ml-4 whitespace-nowrap`}>{text}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LargeNav;
