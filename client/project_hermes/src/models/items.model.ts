export type Item = {
  ActiveFlag: "y" | "n";
  DeviceName: string;
  RestrictedRoles: string;
  ShortDesc: string;
  absolutePrice: number;
  relativePrice: number;
  ItemTier: string;
  games: number;
  wins: number;
  itemIcon_URL: string;
  ItemDescription: {
    Description: string;
    Menuitems: [{ Description: string; Value: string }];
    SecondaryDescription: string;
  };
};

export interface Build {
  relics: { [key: string]: Item }[];
  items: { [key: string]: Item }[];
}
