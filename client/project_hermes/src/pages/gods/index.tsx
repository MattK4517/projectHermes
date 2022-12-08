import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import NextPage from "next/page";
import { getBaseUrl, trpc } from "../../utils/trpc";

interface god {
  name: string;
  url: string;
}

export default function GodsList<NextPage>(props) {
  const { data, isLoading, error } = useQuery<god[]>(
    ["gods", { pageLoaded: "false" }],
    getGods,
    {
      initialData: props.dehydratedState,
    }
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;
  return (
    <div
      className="card grid gap-2"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      }}
    >
      {Object.values(data).map((god: god, index) => {
        return (
          <Link
            key={index}
            href={"/gods/".concat(god.name, "/build")}
            target="_blank"
          >
            <div className="box-border flex h-fit w-fit cursor-pointer flex-col items-center">
              {/* <figure className="relative overflow-hidden border-slate-600"> */}
              <img
                className="h-32 w-32 bg-neutral-900"
                src={god.url}
                alt={god.name}
              />
              {/* <figcaption>
        <p>Stats for {god.name}</p>
      </figcaption>
    </figure> */}
              <div className="w-fit">{god.name}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["gods", { pageLoaded: "false" }], getGods);
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}

async function getGods({ queryKey }) {
  let url = getBaseUrl();
  const [_key, { pageLoaded }] = queryKey;
  return (
    await fetch(
      url +
        "/api/gods?" +
        new URLSearchParams({
          loaded: pageLoaded,
        })
    )
  ).json();
}
