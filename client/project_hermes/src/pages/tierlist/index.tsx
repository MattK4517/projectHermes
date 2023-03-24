import { useContext } from "react";
import TabList from "../../components/general/TabList";
import { TierListContext } from "../../components/tierlist/TierListContext";

function TierIndex() {
  return <div></div>;
}

export default TierIndex;

const TierListLayout = ({ children }: { children: React.ReactNode }) => {
  const { tabs } = useContext(TierListContext);
  return (
    <div id="god-profile-main-page" className="mx-auto flex w-full">
      <div
        id="god-profile-content-container content-side-padding"
        className="w-full sm:px-3"
      >
        <div
          id="god-profile-container page_build"
          className="background-image w-full"
          //   style={{
          //     backgroundImage: `radial-gradient(400px 200px at 60% 34%, rgba(7, 7, 32, 0) 0%, rgb(7, 7, 32) 100%),
          // linear-gradient(90deg, rgb(7, 7, 32) 0%, rgba(7, 7, 32, 0.6) 100%), url(${url})`,
          //   }}
        >
          <div>
            <TabList {...tabs} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export { TierListLayout };
