import { useRouter } from "next/router";
import { useState } from "react";
import LargeNav from "./nav-styles/LargeNav";
import MediumNav from "./nav-styles/MediumNav";
export default function SideNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { route } = router;

  const [_showText, setShowText] = useState(false);

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
