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

export interface GodData {}

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
