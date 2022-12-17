import * as GiIcons from "react-icons/gi";

export default function AppBar(props) {
  return (
    <div className="nav-border-bottom flex h-16 w-screen items-center bg-card p-4 text-fontAlt">
      <div className="flex items-center justify-center">
        <GiIcons.GiHamburgerMenu
          className="h-8 w-8 cursor-pointer sm:mr-7"
          onClick={() => props.setOpen(!props.open)}
        ></GiIcons.GiHamburgerMenu>
      </div>
      <img
        className="mx-auto h-12 w-52 sm:mx-0"
        src="https://i.imgur.com/5kTPiDu.png"
      />
    </div>
  );
}
