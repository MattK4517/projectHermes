import Link from "next/link";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";

export default function SideNav(props) {
  const iconStyling = `w-8 h-8 ${
    props.open ? "" : "opacity-70"
  } hover:fill-[#3273fa] opacity-100`; 

  return (
    <div>
      <div
        className={`nav-border hidden h-full bg-card px-4 py-4 text-white sm:block ${
          props.open ? "w-16" : "w-52"
        }`}
      >
        {["Home", "Gods", "Tierlist", "Contact", "Find A Match"].map(
          (text: string, index: number) => {
            let route = text;
            let icon;

            if (text === "Home") {
              route = "";
              icon = <AiIcons.AiFillHome className={iconStyling} />;
            } else if (text === "Gods") {
              icon = <GiIcons.GiPikeman className={iconStyling} />;
            } else if (text === "Tierlist") {
              icon = <AiIcons.AiOutlineBars className={iconStyling} />;
            } else if (text === "Contact") {
              icon = <AiIcons.AiFillMail className={iconStyling} />;
            } else if (text === "Find A Match") {
              icon = <GiIcons.GiSwordClash className={iconStyling} />;
            } else if (text === "Damage Calculator") {
              icon = <GiIcons.GiSwordman className={iconStyling} />;
            } else {
              route = text;
            }
            return (
              <Link key={index} href={"/".concat(route.toLowerCase())}>
                <div className="mb-2 flex cursor-pointer flex-row items-center ">
                  {icon}
                  <p
                    className={`ml-2 text-fontAlt  ${
                      props.open ? "hidden" : ""
                    }`}
                  >
                    {text}
                  </p>
                </div>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
