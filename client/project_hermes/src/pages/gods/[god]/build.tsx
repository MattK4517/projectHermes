import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import { GodContext } from "../../../components/gods/GodContext";

function BuildPage(props) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  setGod(router.query.god);
  return (
    <GodPageLayout>
      <div className="text-white">BUILD PAGE</div>
    </GodPageLayout>
  );
}

export default BuildPage;
