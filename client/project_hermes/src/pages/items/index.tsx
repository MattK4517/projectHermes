import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import { getItems } from "../../service/gods/general.service";

const ItemsPage = () => {
  return (
    <div className="flex flex-col pb-5 text-white">
      <div className="mb-10">
        <span className="text-3xl font-bold">Smite Item Information</span>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = {
    items: new QueryClient(),
  };

  await queryClient.items.prefetchQuery(["items"], () => getItems());

  return {
    props: {
      dehydratedState: {
        items: JSON.parse(JSON.stringify(dehydrate(queryClient.items))),
      },
    },
    revalidate: 3600,
  };
};

export default ItemsPage;
