

export function GetCarryPlayer(damageScore, goldScore, killPart, wards, distance, assists, role, winStatus, scoringAverages) {
    console.log(scoringAverages)
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