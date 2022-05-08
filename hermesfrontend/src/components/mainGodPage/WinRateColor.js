export default function winRateColor(winRate) {
  var color = "white";
  if (winRate < 45 || !winRate) {
    color = "#ff4e50";
  }
  else if (winRate < 48) {
    color = "#fcb1b2";
  }
  else if (winRate < 51.5) {
    color = "white";
  }
  else if (winRate < 53) {
    color = "#e2ccff";
  }
  else if (winRate < 56) {
    color = "#bf94e4";
  }
  else if (winRate >= 56) {
    color = "#a966ff";
  }
  return color;
}


export function tierColor(tier) {
  let color = "white";
  if (tier === "D") {
    color = "#ff4e50";
  }
  else if (tier === "C") {
    color = "#fcb1b2";
  }
  else if (tier === "B") {
    color = "white";
  }
  else if (tier === "A") {
    color = "#e2ccff";
  }
  else if (tier === "S") {
    color = "#bf94e4";
  }
  else if (tier === "S+") {
    color = "#a966ff";
  }
  return color;
}