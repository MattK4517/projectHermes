export default function CarryPlayerDisplay(props) {
  return (
    <div className="carry-player-display-container">
      <div className="carry-player_header">{props.team} Carry Player</div>
      <div className="carry-player_god-played gtm-tierlist-god">
        <div>
          <div className="god-icon">
            <div
              style={{
                height: "48px",
                width: "48px",
              }}
            >
              <img
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.god
                  .replaceAll(" ", "_")
                  .replaceAll("'", "")
                  .toLowerCase()}.jpg`}
                alt={props.god}
                style={{
                  height: "48px",
                  width: "48px",
                  transformOrigin: "0px 0px 0px",
                }}
              />
            </div>
          </div>
        </div>
        <strong className="god-name">{props.carryScore} / 10</strong>
      </div>
    </div>
  );
}
