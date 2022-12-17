import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Ability } from "../../models/gods.model";
import { getBaseUrl } from "../../utils/trpc";
import PageHeader from "./PageHeader";

const GodPageLayout = (props) => {
  const router = useRouter();

  const { data, isLoading, error } = useQuery<Ability[]>(
    ["god-abilities", god],
    async () => await getGodAbilities(god)
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;

  //@ts-ignore
  let url = linkDict[god?.toString()];

  console.log(data);

  return (
    <div id="god-profile-main-page" className="mx-auto flex w-full">
      <div
        id="god-profile-content-container content-side-padding"
        className="w-full px-3"
      >
        <div
          id="god-profile-container page_build"
          className="background-image w-full"
          style={{
            backgroundImage: `radial-gradient(400px 200px at 60% 34%, rgba(7, 7, 32, 0) 0%, rgb(7, 7, 32) 100%),
            linear-gradient(90deg, rgb(7, 7, 32) 0%, rgba(7, 7, 32, 0.6) 100%), url(${props.url})`,
          }}
        >
          <div>
            <GodPageHeader
              godData={props.data.godData.queries[0]?.state.data}
              godAbilities={props.data.godAbilities.queries[0]?.state.data}
              god={props.god}
            ></GodPageHeader>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GodPageLayout;

const GodPageHeader: NextPage = (props) => {
  return (
    <PageHeader
      abilities={props.godAbilities}
      tier={"D"}
      god={props.god}
      tab={"TAB"}
      role={"ROLE"}
      rank={"RANK"}
      mode={"MODE"}
      queueType={"QUEUETYPE"}
      godData={props.godData}
      patch={""}
    />
  );
};

export { GodPageHeader };

async function getGodAbilities(god: string) {
  let url = getBaseUrl();
  return (await fetch(url + "/api/" + god + "/abilities")).json();
}

async function getGodData(god: string) {
  let url = getBaseUrl();
  return (await fetch(url + "/api/" + god + "/data")).json();
}
