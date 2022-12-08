<<<<<<< HEAD
import { dehydrate, QueryClient, useQueries, useQuery } from "@tanstack/react-query";
=======
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
>>>>>>> b3eb15a ( changes)
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import WinRateStats from "../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../components/gods/GodContext";
import MatchupRow from "../../../components/gods/matchups/MatchupRow";
import { MatchupDisplayType } from "../../../components/gods/matchups/SingleMatchupDisplay";
import { GodWinRateType } from "../../../models/gods/gods.model";
import { getBaseUrl } from "../../../utils/trpc";

function BuildPage(props: { dehydratedState: { godWinrate: any } }) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  if (router.query?.god) setGod(router.query.god);

<<<<<<< HEAD
  const buildPageQueries = useQueries({
    queries: [
      {
        queryKey: ["god-winrate", god],
        queryFn: async () => (await fetch(`/api/main/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json(),
        initialData: props.dehydratedState.godWinrate,
      },
      {
        queryKey: ["god-matchups", god],
        queryFn: async () => (await fetch(`/api/matchups/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json(),
        initialData: props.dehydratedState.godMatchups.data,
      },
    ],
  });

  const isLoading = buildPageQueries.some((query) => query.isLoading);
  const isError = buildPageQueries.some((query) => query.error);
  if (isLoading) return <h1>LOADING...</h1>;
  if (isError) return <h1>ERROR...</h1>;
  const data = buildPageQueries.map((query) => query.data);

  return (
    <GodPageLayout>
      <WinRateStats 
      winRateStats={{...data[0] , queueType: "Ranked"}}
      />
      <MatchupRow matchups={{...data[1]}}/>
    </GodPageLayout>
  );
=======
  console.log(props.dehydratedState);
  const { isSuccess, data, isLoading, error } = useQuery<GodWinRateType>(
    ["god-build", god],
    () => getGodWinRate(god),
    {
      initialData: props.dehydratedState?.godWinrate,
      refetchOnMount: false,
    }
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;

  console.log("DATA WINRATE", data);

  if (isSuccess)
    return (
      <GodPageLayout>
        <WinRateStats
          winRate={data?.winRate}
          pickRate={data?.pickRate}
          banRate={data?.banRate}
          matches={data?.games}
          queueType={"Ranked"}
        />
      </GodPageLayout>
    );
>>>>>>> b3eb15a ( changes)
}

export default BuildPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = {
    godWinRate: new QueryClient(),
    godMatchups:  new QueryClient(),
  };
<<<<<<< HEAD
  const { god } = params;
  

  await queryClient.godWinRate.prefetchQuery<GodWinRateType>(["god-winrate", god], () =>
  getGodWinRate(god)
=======
  const god = context.params?.god as string;

  await queryClient.godWinRate.prefetchQuery(["godBuild", god], () =>
    getGodWinRate(god)
>>>>>>> b3eb15a ( changes)
  );
  await queryClient.godMatchups.prefetchQuery(["god-matchups", god], () =>
  getGodMatchups(god)
  );
  return {
    props: {
      dehydratedState: {
<<<<<<< HEAD
        godWinRate: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godWinRate))
        ),
        godMatchups: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godMatchups))
        ),
=======
        godWinRate: dehydrate(queryClient.godWinRate),
>>>>>>> b3eb15a ( changes)
      },
    },
  };
};

async function getGodWinRate(god: string) {
  let url = getBaseUrl();
<<<<<<< HEAD
  return (await fetch(url + `/api/main/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json();
}

async function getGodMatchups(god: string) {
  let url = getBaseUrl()
  return (await fetch(url + `/api/matchups/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json();
}
=======
  return await fetch(
    url + `/api/main/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`
  ).then((res) => res.json());
}
>>>>>>> b3eb15a ( changes)
