import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import * as GiIcons from "react-icons/gi";
import { ImgurLoader } from "../loader";
import { AppStateContext } from "./AppStateContext";

export default function AppBar() {
  const { open, setOpen } = useContext(AppStateContext);
  return (
    <div className="nav-border-bottom flex h-16 w-screen items-center bg-card px-4 text-fontAlt">
      <div
        className="flex h-full items-center justify-center py-2 pr-4"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <GiIcons.GiHamburgerMenu
          className="h-8 w-8 cursor-pointer fill-white"
          onClick={() => setOpen(!open)}
        ></GiIcons.GiHamburgerMenu>
      </div>
      <Link href={"/"}>
        <Image
          className="h-12 w-52 cursor-pointer"
          loader={ImgurLoader}
          width={208}
          height={48}
          src="https://i.imgur.com/5kTPiDu.png"
          alt="SmiteStats Icon"
        />
      </Link>
    </div>
  );
}
