import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import { GodContext } from "../../../components/gods/GodContext";

function MatchupsPage(props) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  setGod(router.query.god);
  return (
    <GodPageLayout>
      <div className="text-white">MATCHUPS PAGE</div>
    </GodPageLayout>
  );
}

export default MatchupsPage;
