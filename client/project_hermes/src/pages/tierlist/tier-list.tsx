import { TierListLayout } from ".";
import { TierListContext } from "../../components/tierlist/TierListContext";
import { useContext } from "react";
import Filter from "../../components/general/Filter";
import { GetServerSideProps } from "next";
import { GodDefaultFilterLoader } from "../../components/loader";
import { getBaseUrl } from "../../utils/trpc";
import { GodPagePropsType } from "../gods/[god]/build";

const TierList = () => {
  let { filterList, setFilterList } = useContext(TierListContext);
  return (
    <>
      <div>dakljdslakjd</div>
      <TierListLayout>
        <Filter
          filterList={filterList}
          setFilterList={setFilterList}
          defaultParams={{
            god: "",
            role: "",
            rank: "",
            patch: "",
            queueType: "",
            mode: "",
            type: "tierlist",
          }}
        />
        <div className="text-white">
          <span>kfjlasflkdsafl;</span>
        </div>
      </TierListLayout>
    </>
  );
};

export default TierList;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let url = getBaseUrl();
  const defaultParams: GodPagePropsType = await GodDefaultFilterLoader({
    url,
  });

  return {
    props: {
      dehydratedState: {
        defaultParams,
      },
    },
  };
};
