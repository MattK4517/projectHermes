import { getPantheonIcon } from "./gods/GodHelpers";

export default function GodIconLoader(props: { src: string }) {
  return `https://webcdn.hirezstudios.com/smite/god-icons/${props.src
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("'", "")}.jpg`;
}

export function ItemIconLoader(props: { src: string }) {
  return `https://webcdn.hirezstudios.com/smite/item-icons/${props.src
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("'", "")}.jpg`;
}

export function SkinIconLoader(props: { src: string }) {
  return props.src;
}

export function GodAbilityIconLoader(props: { src: string }) {
  return props.src.toLowerCase();
}

export function GodPantheonIconLoader(props: { src: string }) {
  return getPantheonIcon(props.src.toLowerCase());
}

export async function GodDefaultFilterLoader({
  god,
  url,
}: {
  god: string;
  url?: string;
}) {
  return (await fetch(url + `/api/default_filter/${god}`)).json();
}

export const RankIconLoader = (rank: string, mode: string) => {
  let url = "";
  if (rank == "Bronze" && mode === "Conquest") {
    url = "https://i.imgur.com/pNAGUeR.png";
  } else if (rank === "Silver" && mode === "Conquest") {
    url = "https://i.imgur.com/Cm5uf15.png";
  } else if (rank === "Gold" && mode === "Conquest") {
    url = "https://i.imgur.com/L3BmF9F.png";
  } else if (rank === "Platinum" && mode === "Conquest") {
    url = "https://i.imgur.com/6M3Ezca.png";
  } else if (rank === "Diamond" && mode === "Conquest") {
    url = "https://i.imgur.com/dtXd0Kv.png";
  } else if (rank === "Masters" && mode === "Conquest") {
    url = "https://i.imgur.com/2SdBQ4o.png";
  } else if (rank === "Grandmaster" && mode === "Conquest") {
    url = "https://i.imgur.com/uh3i4hc.png";
  } else if (rank == "Bronze" && mode === "Joust") {
    url = "https://i.imgur.com/BdF6iJ8.png";
  } else if (rank === "Silver" && mode === "Joust") {
    url = "https://i.imgur.com/8mAVtDs.png";
  } else if (rank === "Gold" && mode === "Joust") {
    url = "https://i.imgur.com/Mz7OHvM.png";
  } else if (rank === "Platinum" && mode === "Joust") {
    url = "https://i.imgur.com/xZn4mdc.png";
  } else if (rank === "Diamond" && mode === "Joust") {
    url = "https://i.imgur.com/d6CgHKn.png";
  } else if (rank === "Masters" && mode === "Joust") {
    url = "https://i.imgur.com/ymZe7Ac.png";
  } else if (rank === "Grandmaster" && mode === "Joust") {
    url = "https://i.imgur.com/qPBFwD6.png";
  } else if (rank == "Bronze" && mode === "Duel") {
    url = "https://i.imgur.com/QP8sPgx.png";
  } else if (rank === "Silver" && mode === "Duel") {
    url = "https://i.imgur.com/OQv6tsn.png";
  } else if (rank === "Gold" && mode === "Duel") {
    url = "https://i.imgur.com/1KFxDi9.png";
  } else if (rank === "Platinum" && mode === "Duel") {
    url = "https://i.imgur.com/YjMr1UA.png";
  } else if (rank === "Diamond" && mode === "Duel") {
    url = "https://i.imgur.com/MuHM8b1.png";
  } else if (rank === "Masters" && mode === "Duel") {
    url = "https://i.imgur.com/U8Ot31L.png";
  } else if (rank === "Grandmaster" && mode === "Duel") {
    url = "https://i.imgur.com/np7y6QP.png";
  }
  return url;
};
