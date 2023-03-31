import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { getBaseUrl } from "../../utils/trpc";

export async function getLastUpdate(patch: string) {
  const url = getBaseUrl();
  return (await fetch(`${url}/api/get_last_update/${patch}`)).json();
}

export async function getTierListData({
  role,
  rank,
  patch,
  queueType,
  mode,
  type,
}: GodPagePropsType & { type: string }) {
  const url = getBaseUrl();
  return (
    await fetch(
      url +
        `/api/gettierlist/${type}/${rank}/${role}/${queueType}/${patch}/${mode}`
    )
  ).json();
}
