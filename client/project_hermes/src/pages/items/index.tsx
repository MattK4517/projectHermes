import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImgurLoader } from "../../components/loader";
import { Item } from "../../models/items.model";
import { getItems } from "../../service/gods/general.service";

const ItemsPage = ({
  dehydratedState,
}: {
  dehydratedState: {
    items: { queries: [{ state: { data: { items: Item[][] } } }] };
  };
}) => {
  return (
    <div className="flex flex-row pb-5">
      <div className="mb-10">
        <span className="text-3xl font-bold">Smite Item Information</span>
        <div className="flex flex-col">
          {Object.entries(
            dehydratedState.items.queries[0].state.data.items
          ).map((tier, index) => {
            return (
              <div
                key={index}
                className="card flex flex-row flex-wrap justify-start gap-2 p-3"
              >
                <div className="card-header mb-1">
                  {parseInt(tier[0]) ? (
                    <span>Tier {tier[0]}</span>
                  ) : (
                    <span>
                      {tier[0].slice(0, 1).toLocaleUpperCase() +
                        tier[0].slice(1)}
                    </span>
                  )}
                </div>
                {tier[1].flat().map((item: Item, index) => {
                  return (
                    <div key={index}>
                      <Link
                        href={`/items/${item.DeviceName.replaceAll("'", "")
                          .replaceAll(" ", "-")
                          .toLowerCase()}`}
                      >
                        <Image
                          src={item.itemIcon_URL}
                          alt={item.DeviceName}
                          loader={ImgurLoader}
                          width={36}
                          height={36}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
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
