import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { getBaseUrl } from "../../utils/trpc";

export async function getGodWinRate({
  god,
  role,
  rank,
  patch,
  queueType,
  mode,
}: GodPagePropsType) {
  let url = getBaseUrl();
  return (
    await fetch(
      url + `/api/main/${god}/${role}/${rank}/${patch}/${queueType}/${mode}`
    )
  ).json();
}

export async function getGodMatchups({
  god,
  role,
  rank,
  patch,
  queueType,
  mode,
}: GodPagePropsType) {
  let url = getBaseUrl();
  return (
    await fetch(
      url + `/api/matchups/${god}/${role}/${rank}/${patch}/${queueType}/${mode}`
    )
  ).json();
}

export async function getGodBuild({
  god,
  role,
  rank,
  patch,
  queueType,
  mode,
}: GodPagePropsType) {
  let url = getBaseUrl();
  console.log("BUILD");
  return (
    await fetch(
      url + `/api/build/${god}/${role}/${rank}/${patch}/${queueType}/${mode}`
    )
  ).json();
}

export async function getGodAbilities(god: string) {
  let url = getBaseUrl();
  return (await fetch(url + "/api/" + god + "/abilities")).json();
}

export async function getGodData(god: string) {
  let url = getBaseUrl();
  return (await fetch(url + "/api/" + god + "/data")).json();
}
