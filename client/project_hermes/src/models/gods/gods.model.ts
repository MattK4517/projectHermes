export interface AbilityUrls {
  Ability1: Ability;
  Ability2: Ability;
  Ability3: Ability;
  Ability4: Ability;
  Ability5: Ability;
}

export type Ability = {
  Id: number;
  Summary: string;
  URL: string;
  Description: {
    itemDescription: {
      cooldown: string;
      cost: string;
      description: string;
      menuitems: MenuItem[];
      rankitems: MenuItem[];
    };
  };
};

export type MenuItem = {
  description: string;
  value: string;
};

export interface GodData {
  id: string;
  Ability1: string;
  Ability2: string;
  Ability3: string;
  Ability4: string;
  Ability5: string;
  AbilityId1: number;
  AbilityId2: number;
  AbilityId3: number;
  AbilityId4: number;
  AbilityId5: number;
  Ability_1: Ability;
  Ability_2: Ability;
  Ability_3: Ability;
  Ability_4: Ability;
  Ability_5: Ability;
  AttackSpeed: number;
  AttackSpeedPerLevel: number;
  AutoBanned: string;
  Cons: string;
  HP5PerLevel: number;
  Health: number;
  HealthPerFive: number;
  HealthPerLevel: number;
  Lore: string;
  MP5PerLevel: number;
  MagicProtection: number;
  MagicProtectionPerLevel: number;
  MagicalPower: number;
  MagicalPowerPerLevel: number;
  Mana: number;
  ManaPerFive: number;
  ManaPerLevel: number;
  Name: string;
  OnFreeRotation: string;
  Pantheon: string;
  PhysicalPower: number;
  PhysicalPowerPerLevel: number;
  PhysicalProtection: number;
  PhysicalProtectionPerLevel: number;
  Pros: string;
  Roles: string;
  Speed: number;
  Title: string;
  Type: string;
  abilityDescription1: Ability["Description"];
  abilityDescription2: Ability["Description"];
  abilityDescription3: Ability["Description"];
  abilityDescription4: Ability["Description"];
  abilityDescription5: Ability["Description"];
  basicAttack: Ability["Description"];
  godAbility1_URL: string;
  godAbility2_URL: string;
  godAbility3_URL: string;
  godAbility4_URL: string;
  godAbility5_URL: string;
  godCard_URL: string;
  godIcon_URL: string;
  id_: string;
  latestGod: string;
}

export type GodWinRateType = {
  banRate: number;
  games: number;
  godBans: number;
  pickRate: number;
  totalMatches: number;
  winRate: number;
  wins: number;
  tier: string;
};

export type tier = "D" | "C" | "B" | "A" | "S" | "S+";

export type god =
  | ""
  | "Achilles"
  | "Agni"
  | "Ah Muzen Cab"
  | "Ah Puch"
  | "Amaterasu"
  | "Anhur"
  | "Anubis"
  | "Ao Kuang"
  | "Aphrodite"
  | "Apollo"
  | "Arachne"
  | "Ares"
  | "Artemis"
  | "Artio"
  | "Athena"
  | "Atlas"
  | "Awilix"
  | "Baba Yaga"
  | "Bacchus"
  | "Bakasura"
  | "Baron Samedi"
  | "Bastet"
  | "Bellona"
  | "Cabrakan"
  | "Camazotz"
  | "Cerberus"
  | "Cernunnos"
  | "Chaac"
  | "Chang'e"
  | "Charybdis"
  | "Chernobog"
  | "Chiron"
  | "Chronos"
  | "Cliodhna"
  | "Cthulhu"
  | "Cu Chulainn"
  | "Cupid"
  | "Da Ji"
  | "Danzaburou"
  | "Discordia"
  | "Erlang Shen"
  | "Eset"
  | "Fafnir"
  | "Fenrir"
  | "Freya"
  | "Ganesha"
  | "Geb"
  | "Gilgamesh"
  | "Guan Yu"
  | "Hachiman"
  | "Hades"
  | "He Bo"
  | "Heimdallr"
  | "Hel"
  | "Hera"
  | "Hercules"
  | "Horus"
  | "Hou Yi"
  | "Hun Batz"
  | "Ishtar"
  | "Izanami"
  | "Janus"
  | "Jing Wei"
  | "Jormungandr"
  | "Kali"
  | "Khepri"
  | "King Arthur"
  | "Kukulkan"
  | "Kumbhakarna"
  | "Kuzenbo"
  | "Lancelot"
  | "Loki"
  | "Maui"
  | "Medusa"
  | "Mercury"
  | "Merlin"
  | "Morgan Le Fay"
  | "Mulan"
  | "Ne Zha"
  | "Neith"
  | "Nemesis"
  | "Nike"
  | "Nox"
  | "Nu Wa"
  | "Odin"
  | "Olorun"
  | "Osiris"
  | "Pele"
  | "Persephone"
  | "Poseidon"
  | "Ra"
  | "Raijin"
  | "Rama"
  | "Ratatoskr"
  | "Ravana"
  | "Scylla"
  | "Serqet"
  | "Set"
  | "Shiva"
  | "Skadi"
  | "Sobek"
  | "Sol"
  | "Sun Wukong"
  | "Susano"
  | "Sylvanus"
  | "Terra"
  | "Thanatos"
  | "The Morrigan"
  | "Thor"
  | "Thoth"
  | "Tiamat"
  | "Tsukuyomi"
  | "Tyr"
  | "Ullr"
  | "Vamana"
  | "Vulcan"
  | "Xbalanque"
  | "Xing Tian"
  | "Yemoja"
  | "Ymir"
  | "Yu Huang"
  | "Zeus"
  | "Zhong Kui";

export interface Skin {
  games: number;
  price_favor: number;
  price_gems: number;
  winRate: number;
  wins: number;
  godSkin_URL: string;
  obtainability: string;
  skin_name: string;
}

export interface ISkinStatsReturnType {
  skins: Skin[];
}

export interface DetailMatchup {
  _id: string;
  avgDmgDiff: string;
  avgGoldDiff: string;
  avgKillDiff: string;
  games: {
    games: string;
    pickRate: number;
    winRate: number;
  };
  wins: number;
}

export interface IDetailMatchupsReturnType {
  entires: DetailMatchup[];
}
