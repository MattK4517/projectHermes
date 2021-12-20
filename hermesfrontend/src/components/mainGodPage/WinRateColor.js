export default function winRateColor(winRate) {
    var color = "white";
    if (winRate < 45){
      color = "#ff4e50";
    }
    else if (winRate < 48){
      color = "#fcb1b2";
    }
    else if (winRate < 51.5){
      color = "white";
    }
    else if (winRate < 53){
      color = "#7ea4f4";
    }
    else if (winRate < 56){
      color = "#3273fa";
    }
    else if (winRate >= 56){
      color = "#70ea0f";
    }
    return color;
  }
