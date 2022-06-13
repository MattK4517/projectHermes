


export interface TierListEntry {
    patch: string,
    queue_type: string,
    mode: string,
    Entry_Datetime: string,
    role: string,
    rank: string,
    god: string,
    tier: string,
    winRate: number,
    pickRate: number,
    banRate: number,
    counterMatchups: CounterMatchups,
    games: number,
    kills: number,
    deaths: number,
    damage_: number,
    damageTaken: number,
    damageMitigated: number,
    healing: number,
    selfHealing: number,
    gold: number,
    damageBot: number,
    killsBot: number,
    towerKills: number,
}

export type CounterMatchups = {
    [god in gods]: CounterMatchupData
};

export type CounterMatchupData = {
    enemy: string;
    timesPlayed: number;
    wins: number;
    winRate: 0;
}
export interface TierListDataResponse {
   Solo?: TierListEntry,
   Jungle?: TierListEntry,
   Mid?: TierListEntry,
   Support?: TierListEntry,
   Carry?: TierListEntry,
}

export type roles = "Solo" | "Jungle" | "Mid" | "Support" | "Carry";
export type gods = "Achilles" |
"Agni" |
"Ah Muzen Cab" |
"Ah Puch" |
"Amaterasu" |
"Anhur" |
"Anubis" |
"Ao Kuang" |
"Aphrodite" |
"Apollo" |
"Arachne" |
"Ares" |
"Artemis" |
"Artio" |
"Athena" |
"Atlas" |
"Awilix" |
"Baba Yaga" |
"Bacchus" |
"Bakasura" |
"Baron Samedi" |
"Bastet" |
"Bellona" |
"Cabrakan" |
"Camazotz" |
"Cerberus" |
"Cernunnos" |
"Chaac" |
"Chang\'e" |
"Charybdis" |
"Chernobog" |
"Chiron" |
"Chronos" |
"Cliodhna" |
"Cthulhu" |
"Cu Chulainn" |
"Cupid" |
"Da Ji" |
"Danzaburou" |
"Discordia" |
"Erlang Shen" |
"Eset" |
"Fafnir" |
"Fenrir" |
"Freya" |
"Ganesha" |
"Geb" |
"Gilgamesh" |
"Guan Yu" |
"Hachiman" |
"Hades" |
"He Bo" |
"Heimdallr" |
"Hel" |
"Hera" |
"Hercules" |
"Horus" |
"Hou Yi" |
"Hun Batz" |
"Izanami" |
"Janus" |
"Jing Wei" |
"Jormungandr" |
"Kali" |
"Khepri" |
"King Arthur" |
"Kukulkan" |
"Kumbhakarna" |
"Kuzenbo" |
"Loki" |
"Medusa" |
"Mercury" |
"Merlin" |
"Morgan Le Fay" |
"Mulan" |
"Ne Zha" |
"Neith" |
"Nemesis" |
"Nike" |
"Nox" |
"Nu Wa" |
"Odin" |
"Olorun" |
"Osiris" |
"Pele" |
"Persephone" |
"Poseidon" |
"Ra" |
"Raijin" |
"Rama" |
"Ratatoskr" |
"Ravana" |
"Scylla" |
"Serqet" |
"Set" |
"Shiva" |
"Skadi" |
"Sobek" |
"Sol" |
"Sun Wukong" |
"Susano" |
"Sylvanus" |
"Terra" |
"Thanatos" |
"The Morrigan" |
"Thor" |
"Thoth" |
"Tiamat" |
"Tsukuyomi" |
"Tyr" |
"Ullr" |
"Vamana" |
"Vulcan" |
"Xbalanque" |
"Xing Tian" |
"Yemoja" |
"Ymir" |
"Yu Huang" |
"Zeus" |
"Zhong Kui";