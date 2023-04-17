import { GetStaticProps } from "next";
import Image from "next/image";
import { QueryClient, dehydrate } from "react-query";
import { ImgurLoader } from "../../../components/loader";
import { Item } from "../../../models/items.model";
import { getItem } from "../../../service/gods/general.service";

const getItemMessage = () => {
  return "";
};

const SingleItemPage = ({
  dehydratedState,
}: {
  dehydratedState: {
    items: { queries: [{ state: { data: { items: Item[] } } }] };
  };
}) => {
  console.log(dehydratedState);
  const item = dehydratedState.items.queries[0].state.data.items[0];
  console.log(item);
  return (
    <div className="mb-6 w-full" id="god-page-header">
      <div className="flex w-full items-center" id="god-header-wrap">
        <div className="max-w-2xl">
          <div className="relative h-24 w-24 flex-initial rounded-md border-2">
            <div className="relative h-full w-full ">
              <div className="relative h-full w-full overflow-hidden rounded-md border-2 border-card">
                <div className="god-image object-cover">
                  <Image
                    src={item.itemIcon_URL}
                    alt={item.DeviceName}
                    loader={ImgurLoader}
                    fill={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-6 flex h-full min-w-0 flex-1 flex-col justify-between">
          <h3 className="mb-2 flex flex-col">
            <span className="text-3xl font-bold">{item.DeviceName}</span>
            <span className="text-xl text-lightBlue">{item?.ShortDesc}</span>
          </h3>
        </div>
      </div>
      <div className="mt-10 flex gap-4">
        <div className="card min-w-[66%]">
          <div className="card-header"></div>
        </div>
        <div className="card">
          <div className="card-header">{item.DeviceName} Stats</div>
          <div className="flex flex-col gap-2">
            {item?.ItemDescription.Menuitems.map((statDesc) => {
              return (
                <span className="font-bold">
                  <span className="text-lightBlue">{statDesc.Description}</span>
                  : {statDesc.Value}
                </span>
              );
            })}
            {item?.ItemDescription?.SecondaryDescription?.includes(
              "PASSIVE"
            ) ? (
              <div className="card-header pt-2">Passive</div>
            ) : null}
            {item?.ItemDescription?.SecondaryDescription?.includes("AURA") ? (
              <>
                <div className="card-header pt-2">Aura</div>
                <span>{item?.ItemDescription?.SecondaryDescription}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { item: "light-blade" } },
      { params: { item: "sovereignty" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = {
    items: new QueryClient(),
  };

  const { item } = context.params;

  await queryClient.items.prefetchQuery(["items"], () => getItem(item));

  return {
    props: {
      dehydratedState: {
        items: JSON.parse(JSON.stringify(dehydrate(queryClient.items))),
      },
    },
    revalidate: 1814400,
  };
};

export default SingleItemPage;
