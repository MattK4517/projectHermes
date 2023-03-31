import Link from "next/link";

const CounterMatchupDisplay = (props: {
  matchups: { [s: string]: unknown } | ArrayLike<unknown>;
}) => {
  return (
    <div className="against-container">
      {Object.values(props.matchups)
        .sort(sortMatchups)
        .map((matchup, index) => {
          if (index < 9) {
            let routegod = matchup.enemy.replaceAll(" ", "_");
            let styling;
            if (matchup.winRate > 50) {
              styling = { height: "24px", width: "24px" };
            } else {
              styling = {
                height: "24px",
                width: "24px",
                opacity: ".4",
                filter: "grayscale(100%)",
              };
            }
            return (
              <div className="against" key={index}>
                <Link to={"/".concat(routegod)}>
                  <div className="god-face" style={{ maxWidth: "100px" }}>
                    <div>
                      <img
                        src={`https://webcdn.hirezstudios.com/smite/god-icons/${matchup.enemy
                          .toLowerCase()
                          .replaceAll("'", "")
                          .replaceAll(" ", "-")}.jpg`}
                        alt={`https://webcdn.hirezstudios.com/smite/god-icons/${matchup.enemy
                          .toLowerCase()
                          .replaceAll("'", "")
                          .replaceAll(" ", "-")}.jpg`}
                        style={styling}
                        loading="lazy"
                      ></img>
                    </div>
                  </div>
                </Link>
              </div>
            );
          }
        })}
    </div>
  );
};

export default CounterMatchupDisplay;
