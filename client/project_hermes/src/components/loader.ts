import { getPantheonIcon } from "./gods/GodHelpers";

export default function GodIconLoader(props: { src: string }) {
  return `https://webcdn.hirezstudios.com/smite/god-icons/${props.src.toLowerCase()}.jpg`;
}

export function GodAbilityIconLoader(props: { src: string }) {
  return props.src.toLowerCase();
}

export function GodPantheonIconLoader(props: { src: string }) {
  return getPantheonIcon(props.src.toLowerCase());
}
