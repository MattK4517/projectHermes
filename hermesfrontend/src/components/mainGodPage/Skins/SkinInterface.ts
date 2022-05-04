import { CombatStats } from "../../GeneralInterface";

export interface SkinBasic {
    games: number,
    godSkin_URL: string,
    obtainability: string,
    price_favor: number,
    price_gems: number,
    skin_name: string,
    winRate: number,
    wins: number,
}

export interface SkinStats {
    players: CombatStats[],
    games: number,
    win_rate: number,
    wins: number,
}