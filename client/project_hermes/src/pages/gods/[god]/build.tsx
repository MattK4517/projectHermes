import { dehydrate, QueryClient, useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import WinRateStats from "../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../components/gods/GodContext";
import MatchupRow from "../../../components/gods/matchups/MatchupRow";
import { MatchupDisplayType } from "../../../components/gods/matchups/SingleMatchupDisplay";
import { GodWinRateType } from "../../../models/gods/gods.model";
import { getBaseUrl } from "../../../utils/trpc";

function BuildPage(props) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  setGod(router.query.god);

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
}

export default BuildPage; 

export async function getServerSideProps({ params }) {
  const queryClient = {
    godWinRate: new QueryClient(),
    godMatchups:  new QueryClient(),
  };
  const { god } = params;
  

  await queryClient.godWinRate.prefetchQuery<GodWinRateType>(["god-winrate", god], () =>
  getGodWinRate(god)
  );
  await queryClient.godMatchups.prefetchQuery(["god-matchups", god], () =>
  getGodMatchups(god)
  );
  return {
    props: {
      dehydratedState: {
        godWinRate: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godWinRate))
        ),
        godMatchups: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godMatchups))
        ),
      },
    },
  };
}

async function getGodWinRate(god: string) {
  let url = getBaseUrl();
  return (await fetch(url + `/api/main/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json();
}

async function getGodMatchups(god: string) {
  let url = getBaseUrl()
  return (await fetch(url + `/api/matchups/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json();
}