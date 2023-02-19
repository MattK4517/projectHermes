import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getBaseUrl, trpc } from "../../utils/trpc";

interface god {
  name: string;
  url: string;
}

export default function GodsList<NextPage>(props) {
  const { data, isLoading, error } = useQuery<god[]>(["gods"], getGods, {
    initialData: props.dehydratedState,
  });

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;
  return (
    <div>
      <div className="flex flex-col py-8 text-white">
        <h1>God Search</h1>
        <h2>Find the best Data for each God</h2>
      </div>
      <div
        className="card grid grid-cols-10  gap-2"
        // style={{
        //   gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        // }}
      >
        {Object.values(data).map((god: god, index) => {
          return (
            <Link
              key={index}
              href={"/gods/".concat(god.name, "/build")}
              target="_blank"
            >
              <div className="box-border flex h-fit w-fit cursor-pointer flex-col items-center">
                <img
                  className="h-20 w-20 bg-neutral-900"
                  src={god.url}
                  alt={god.name}
                />
                <div className="w-fit text-xs text-lightBlue">{god.name}</div>
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

async function getGods() {
  let url = getBaseUrl();
  return (await fetch(url + "/api/gods")).json();
}
