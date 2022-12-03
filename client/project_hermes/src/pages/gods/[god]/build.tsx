import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GodPageLayout } from ".";
import WinRateStats from "../../../components/gods/build/WinRateStats";
import { GodContext } from "../../../components/gods/GodContext";
import { GodWinRateType } from "../../../models/gods/gods.model";
import { getBaseUrl } from "../../../utils/trpc";

function BuildPage(props) {
  const router = useRouter();
  const { god, setGod } = useContext(GodContext);
  setGod(router.query.god);

  const { data, isLoading, error } = useQuery<GodWinRateType>(["god-build", god], async () => await getGodWinRate(god), {
    initialData: props.dehydratedState.godWinrate,
  });

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;

  console.log("DATA WINRATE", data)

  return (
    <GodPageLayout>
      <WinRateStats 
        winRate={data?.winRate} 
        pickRate={data?.pickRate} 
        banRate={data?.banRate} 
        matches={data?.games}  
      />
    </GodPageLayout>
  );
}

export default BuildPage; 

export async function getServerSideProps({ params }) {
  const queryClient = {
    godWinRate: new QueryClient(),
  };
  const { god } = params;

  await queryClient.godWinRate.prefetchQuery(["god-build", god], () =>
  getGodWinRate(god)
  );
  return {
    props: {
      dehydratedState: {
        godWinRate: JSON.parse(
          JSON.stringify(dehydrate(queryClient.godWinRate))
        ),
      },
    },
  };
}

async function getGodWinRate(god: string) {
  let url = getBaseUrl();
  return (await fetch(url + `/api/main/${god}/Solo/All%20Ranks/9.11/Ranked/Conquest`)).json();
}