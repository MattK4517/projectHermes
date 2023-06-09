import { god, tier } from "../../models/gods/gods.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build/[role]";
import { FilterListType } from "../general/Filter";
import { getDefaultParams } from "../general/getDefaultParams";

export const getPantheonIcon = (pantheon: string) => {
  let icon = "";
  if (pantheon === "Arthurian") {
    icon = "https://i.imgur.com/MZ6yMuc.png";
  }
  if (pantheon === "Babylonian") {
    icon = "https://i.imgur.com/dgZ0apd.png";
  }
  if (pantheon === "Celtic") {
    icon = "https://i.imgur.com/ybtnDzR.png";
  }
  if (pantheon === "Chinese") {
    icon = "https://i.imgur.com/uvxiRs4.png";
  }
  if (pantheon === "Egyptian") {
    icon = "https://i.imgur.com/MR87YIR.png";
  }
  if (pantheon === "Great Old Ones") {
    icon = "https://i.imgur.com/2R7kzOU.png";
  }
  if (pantheon === "Greek") {
    icon = "https://i.imgur.com/J0NAjiE.png";
  }
  if (pantheon === "Hindu") {
    icon = "https://i.imgur.com/MnTweMC.png";
  }
  if (pantheon === "Japanese") {
    icon = "https://i.imgur.com/mzKzQPA.png";
  }
  if (pantheon === "Maya") {
    icon = "https://i.imgur.com/5h2iH4h.png";
  }
  if (pantheon === "Norse") {
    icon = "https://i.imgur.com/7hyY058.png";
  }
  if (pantheon === "Polynesian") {
    icon = "https://i.imgur.com/nVkpEWj.png";
  }
  if (pantheon === "Roman") {
    icon = "https://i.imgur.com/62RiqSx.png";
  }
  if (pantheon === "Slavic") {
    icon = "https://i.imgur.com/e8SCQCk.png";
  }
  if (pantheon === "Voodoo") {
    icon = "https://i.imgur.com/zGi6PDo.png";
  }
  if (pantheon === "Yoruba") {
    icon = "https://i.imgur.com/jDLs6nn.png";
  }
  return icon;
};

export const getTierColor = (tier: tier): string => {
  let color = "#414165";
  if (tier === "D") {
    color = "#ff4e50";
  } else if (tier === "C") {
    color = "#fcb1b2";
  } else if (tier === "B") {
    color = "white";
  } else if (tier === "A") {
    color = "#e2ccff";
  } else if (tier === "S") {
    color = "#bf94e4";
  } else if (tier === "S+") {
    color = "#a966ff";
  }
  return color;
};

export const getWinRateColor = (winRate: number): string => {
  let color = "white";
  if (winRate < 42 || !winRate) {
    color = "#ff4e50";
  } else if (winRate < 48) {
    color = "#fcb1b2";
  } else if (winRate < 51.5) {
    color = "white";
  } else if (winRate < 53) {
    color = "#e2ccff";
  } else if (winRate < 56) {
    color = "#bf94e4";
  } else if (winRate >= 56) {
    color = "#a966ff";
  }
  return color;
};

export const getPlayerWinRateColor = (winRate: number): string => {
  let color = "white";
  if (winRate < 51.5) {
    color = "white";
  } else if (winRate < 60) {
    color = "#e2ccff";
  } else if (winRate < 64) {
    color = "#bf94e4";
  } else if (winRate >= 70) {
    color = "#a966ff";
  }
  return color;
};

export const getRankTierColor = (rank: string) => {
  let color = "white";
  if (rank === "Bronze") {
    color = "yellow-600";
  } else if (rank == "Grandmaster") {
    color = "yellow-200";
  }
  return color;
};

export const handleQueryEnabled = (
  defaultParams: GodPagePropsType,
  filterList: FilterListType[]
) => {
  const enabled =
    JSON.stringify(Object.values(defaultParams).sort()) !==
    JSON.stringify(
      Object.values(getDefaultParams(filterList, defaultParams.god)).sort()
    );
  return enabled;
};

export const normalizeTier = (tier: string) => {
  let rank = "Error";
  if (tier <= 5) {
    rank = "Bronze";
  } else if (tier <= 10) {
    rank = "Silver";
  } else if (tier <= 15) {
    rank = "Gold";
  } else if (tier <= 20) {
    rank = "Platinum";
  } else if (tier <= 25) {
    rank = "Diamond";
  } else if (tier == 26) {
    rank = "Masters";
  } else if (tier == 27) {
    rank = "Grandmaster";
  }
  return rank;
};

export const normalizeGodName = (god: god | string) => {
  return god.toLowerCase().replaceAll("'", "").replaceAll(" ", "-")
}