import { GetServerSideProps } from "next";
import { useContext } from "react";
import { TierListLayout } from ".";
import Filter from "../../components/general/Filter";
import { GodDefaultFilterLoader } from "../../components/loader";
import { TierListContext } from "../../components/tierlist/TierListContext";
import { getBaseUrl } from "../../utils/trpc";
import { GodPagePropsType } from "../gods/[god]/build";

const TierList = () => {
  const { filterList, setFilterList } = useContext(TierListContext);
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

export const getServerSideProps: GetServerSideProps = async () => {
  const url = getBaseUrl();
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
