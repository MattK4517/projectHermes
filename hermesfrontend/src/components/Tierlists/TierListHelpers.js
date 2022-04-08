import winRateColor from "../mainGodPage/WinRateColor"

export function compareNumericString(rowA, rowB, id, desc) {
  let a = Number.parseFloat(rowA.values[id]);
  let b = Number.parseFloat(rowB.values[id]);
  if (Number.isNaN(a)) {  // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

export function compareTier(rowA, rowB, id, desc) {
  let a = rowA.values[id]
  let B = rowB.values[id]
}

export function CreateMatchupToolTip(props) {
  return (
    <div className="matchup-tooltip-container">
      <div className="matchup-tooltip">
        <div className="god-icon">
          <div style={{ height: "30px", width: "30px" }}>
            <img
              src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.god
                .replaceAll(" ", "-")
                .replaceAll("'", "")
                .toLowerCase()}.jpg`}
              alt={props.god}
              style={{
                height: "48px",
                width: "48px",
                transform: "scale(0.625)",
                transformOrigin: "0px 0px 0px",
              }}
            />
          </div>
        </div>
        <span style={{ color: "white", paddingTop: ".3rem" }}>
          wins&nbsp;
          <b style={{ color: winRateColor(props.winrate) }}>{props.winrate}%</b>
          &nbsp;vs&nbsp;
        </span>
        <div className="god-icon">
          <div style={{ height: "30px", width: "30px" }}>
            <img
              src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.enemy
                .replaceAll(" ", "-")
                .replaceAll("'", "")
                .toLowerCase()}.jpg`}
              alt={props.enemy}
              style={{
                height: "48px",
                width: "48px",
                transform: "scale(0.625)",
                transformOrigin: "0px 0px 0px",
              }}
            />
          </div>
        </div>
      </div>
      <p>{props.games} games</p>
    </div>
  );
}


