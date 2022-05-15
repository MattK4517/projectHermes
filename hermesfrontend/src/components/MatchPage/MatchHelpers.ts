import { Team, IMatch } from "./MatchInterface"

export function GetCarryPlayer(damageScore: number, goldScore: number, killPart: number, wards: number, distance: number, assists: number, role: string, winStatus: string, scoringAverages: any) {
    let avgDamage = scoringAverages["damageScore"][winStatus][role]["damageShare"]["avg"]
    let stdDevDamage = scoringAverages["damageScore"][winStatus][role]["damageShare"]["stdDev"]
    let avgDiffDamage = damageScore - avgDamage
    let scoreDamage = avgDiffDamage % stdDevDamage

    let avgGold = scoringAverages["goldScore"][winStatus][role]["goldShare"]["avg"]
    let stdDevGold = scoringAverages["goldScore"][winStatus][role]["goldShare"]["stdDev"]
    let avgDiffGold = goldScore - avgGold
    let scoreGold = avgDiffGold % stdDevGold

    let avgKillPart = scoringAverages["killPart"][winStatus][role]["killShare"]["avg"]
    let stdDevKillPart = scoringAverages["killPart"][winStatus][role]["killShare"]["stdDev"]
    let avgDiffKillPart = killPart - avgKillPart
    let scoreKillPart = avgDiffKillPart % stdDevKillPart

    // console.log(damageScore, avgDamage, scoreDamage)
    // console.log(goldScore, avgGold, scoreGold)
    // console.log(killPart, avgKillPart, scoreKillPart)
    return scoreDamage + scoreGold + scoreKillPart + ((wards+assists*100000)/distance)

}

const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;

export function parseMatchData(match: IMatch): Team[] {
    let winningTeam: Team = {
        bans: [match.Ban0, match.Ban2, match.Ban4, match.Ban6, match.Ban8],
        gods: [],
        mmr: [0],
        team: "Winning",
        carryPlayer: "None",
        carryScore: 0,
    }

    let losingTeam: Team = {
        bans: [match.Ban1, match.Ban3, match.Ban5, match.Ban7, match.Ban9],
        gods: [],
        mmr: [0],
        team: "Winning",
        carryPlayer: "None",
        carryScore: 0,
    }

    for (const [key, value] of Object.entries(match)) {
      if (key.includes("player")) {
        if (value.Win_Status === "Winner") {
          winningTeam.gods.push(value.godName)
          winningTeam.mmr.push(value.Ranked_Stat_Conq)
        } else {
          losingTeam.gods.push(value.godName)
          losingTeam.mmr.push(value.Ranked_Stat_Conq)
        }
      }
    }



    return [winningTeam, losingTeam]
}

export const normalizeRank = (tier: number) => {
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
  