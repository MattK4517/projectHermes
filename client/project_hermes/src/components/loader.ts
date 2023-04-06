import { linkDict } from "../pages/gods/[god]";
import { getPantheonIcon } from "./gods/GodHelpers";

export default function GodIconLoader(props: { src: string }) {
  console.log(Object.keys(linkDict).indexOf(props.src))
  if (Object.keys(linkDict).indexOf(props.src) !== -1)
    return `https://webcdn.hirezstudios.com/smite/god-icons/${props.src
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("'", "")}.jpg`
  else return "https://i.imgur.com/KgTaobI.png"
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

export function ImgurLoader(props: { src: string }) {
  return props.src;
}

export async function GodDefaultFilterLoader({
  god,
  url,
}: {
  god: string;
  url?: string;
}) {
  console.log(url + `/api/default_filter/${god}`)
  return (await fetch(url + `/api/default_filter/${god}`)).json();
}

export async function TierListDefaultFilterLoader({
  url,
  type,
}: {
  url: string;
  type: string;
}) {
  console.log("HERE", url + `/api/default_filter/${type}`)
  return (await fetch(url + `/api/default_filter/${type}`)).json();
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

export const RoleIconLoader = (props: { src: string }) => {
  let url: string = "";
  if (props.src === "Solo") {
    url = "https://i.imgur.com/WLU0Cel.png";
  } else if (props.src === "Jungle") {
    url = "https://i.imgur.com/CyXnzEO.png";
  } else if (props.src === "Mid") {
    url = "https://i.imgur.com/0oQkAAZ.png";
  } else if (props.src === "Support") {
    url = "https://i.imgur.com/l7CD2QM.png";
  } else if (props.src === "Carry") {
    url = "https://i.imgur.com/RlRTbrA.png";
  }
  return url;
};
