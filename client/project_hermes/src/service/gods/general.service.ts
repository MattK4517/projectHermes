import { getApiUrl } from "../../utils/trpc";

export async function getLeaderboard(queueType: string) {
  const url = getApiUrl();
  return (await fetch(`${url}/api/leaderboard/${queueType}`)).json();
}

export async function getItems() {
  const url = getApiUrl();
  return (await fetch(`${url}/api/getitems`)).json();
}

export async function getItem(item: string) {
  const url = getApiUrl();
  return (await fetch(`${url}/api/getitemdata/${item}`)).json();
}
