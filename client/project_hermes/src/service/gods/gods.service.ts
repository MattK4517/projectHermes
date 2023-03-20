import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { getBaseUrl } from "../../utils/trpc";

export async function getGodPageData({
  god,
  role,
  rank,
  patch,
  queueType,
  mode,
  type,
}: GodPagePropsType & { type: string }) {
  let url = getBaseUrl();
  return (
    await fetch(
      url + `/api/${type}/${god}/${role}/${rank}/${patch}/${queueType}/${mode}`
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
