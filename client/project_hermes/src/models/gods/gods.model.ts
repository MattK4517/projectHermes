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
}