import { useRouter } from "next/router";
import { NextPage } from "next";

const GodPage: NextPage = () => {
  const router = useRouter();
  const { god } = router.query;
  console.log(god);
  return (
    <div id="god-profile-main-page">
      <div id="god-profile-content-container content-side-padding">
        <div id="god-profile-container BGIMAGEHERE page_build"></div>
      </div>
    </div>
  );
};

export default GodPage;

interface PageHeaderProps {
  tier: string;
  url: string;
  god: string;
  tab: string;
  role: string;
  rank: string;
  mode: string;
  queueType: string;
  // abilities:
}

const PageHeader = () => {
  return <div></div>;
};
