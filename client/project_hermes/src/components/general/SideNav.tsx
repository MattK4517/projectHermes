import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AppStateContext } from "./AppStateContext";
import LargeNav from "./nav-styles/LargeNav";
import MediumNav from "./nav-styles/MediumNav";
export default function SideNav() {
  const router = useRouter();
  const { route } = router;

  const [_showText, setShowText] = useState(false);
  const { open, setOpen } = useContext(AppStateContext);

  return (
    <div className="side-nav-test absolute sm:h-full" style={{ zIndex: "100" }}>
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
