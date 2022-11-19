import * as GiIcons from "react-icons/gi";

export default function AppBar(props) {
  return (
    <div className="nav-border-bottom flex h-16 w-screen items-center bg-card p-4 text-fontAlt">
      <div>
        <GiIcons.GiHamburgerMenu
          className="mb-7 h-8 w-8 cursor-pointer"
          onClick={() => props.setOpen(!props.open)}
        ></GiIcons.GiHamburgerMenu>
      </div>
      <img className="h-12 w-52" src="https://i.imgur.com/5kTPiDu.png" />
    </div>
  );
}
