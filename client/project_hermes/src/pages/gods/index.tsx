import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ImgurLoader } from "../../components/loader";
import { getBaseUrl } from "../../utils/trpc";
import { normalizeGodName } from "../../components/gods/GodHelpers";

interface god {
  name: string;
  url: string;
}

export default function GodsList(props: { dehydratedState: any }) {
  const { data } = useQuery<god[]>(["gods"], getGods, {
    initialData: props.dehydratedState,
  });

  return (
    <div>
      <div className="flex flex-col py-8 text-white">
        <span className="text-3xl">God Search</span>
        <span className="text-lg">Find the best data for each God</span>
      </div>
      <div
        className="card flex flex-row flex-wrap gap-6"
        // style={{
        //   gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        // }}
      >
        {Object.values(data).map((god: god, index) => {
          return (
            <Link
              key={index}
              href={"/gods/".concat(normalizeGodName(god.name), "/build")}
            >
              <div className="box-border flex h-fit w-fit cursor-pointer flex-col items-center hover:scale-110">
                <Image
                  className="h-20 w-20 rounded bg-neutral-900 hover:border-2 hover:border-winnerColor"
                  src={god.url}
                  loader={ImgurLoader}
                  width={80}
                  height={80}
                  alt={god.name}
                />
                <div className="mt-1 w-fit text-xs text-lightBlue">
                  {god.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["gods"], getGods);
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}

export async function getGods() {
  const url = getBaseUrl();
  return (await fetch(url + "/api/gods")).json();
}
