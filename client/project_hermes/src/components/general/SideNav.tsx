import { Disclosure, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AiFillHome,
  AiOutlineBars,
  AiFillMail,
  AiFillTrophy,
  AiFillShop,
  AiOutlineDown,
} from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import LargeNav from "./nav-styles/LargeNav";
import MediumNav from "./nav-styles/MediumNav";
export default function SideNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const router = useRouter();
  const { route } = router;

  const [showText, setShowText] = useState(false);

  return (
    <div className="side-nav-test absolute lg:h-full" style={{ zIndex: "100" }}>
      <LargeNav
        open={open}
        route={route}
        setShowText={setShowText}
        setOpen={setOpen}
      />
      <MediumNav
        open={open}
        setOpen={setOpen}
        route={route}
        setShowText={setShowText}
      />
    </div>
  );
}
