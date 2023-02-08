import Link from "next/link";
import * as GiIcons from "react-icons/gi";
import Filter from "./Filter";

export default function AppBar(props) {
  return (
    <div className="nav-border-bottom flex h-16 w-screen items-center bg-card p-4 text-fontAlt">
      <div className="flex items-center justify-center py-2 pr-4">
        <GiIcons.GiHamburgerMenu
          className="h-8 w-8 cursor-pointer"
          onClick={() => props.setOpen(!props.open)}
        ></GiIcons.GiHamburgerMenu>
      </div>
      <Link href={"/"}>
        <img
          className="h-12 w-52 cursor-pointer"
          src="https://i.imgur.com/5kTPiDu.png"
        />
      </Link>
    </div>
  );
}
