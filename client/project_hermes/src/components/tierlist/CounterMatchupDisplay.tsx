import Image from "next/image";
import Link from "next/link";
import { god } from "../../models/gods/gods.model";
import GodIconLoader from "../loader";

const sortMatchups = (a: { winRate: number }, b: { winRate: number }) => {
  if (a.winRate > b.winRate) {
    return 1;
  } else if (a.winRate === b.winRate) {
    return 0;
  } else {
    return -1;
  }
};

type MatchupType = {
  banRate: number;
  games: number;
  god: god;
  patch: string;
  pickRate: number;
  rank: string;
  role: string;
  winRate: number;
  counterMatchups: {
    enemy: god;
    games: number;
    winRate: number;
    wins: number;
  }[];
};

const CounterMatchupDisplay = ({
  props,
}: {
  props: MatchupType["counterMatchups"];
}) => {
  console.log(props);
  return (
    <div className="flex">
      {Object.values(props)
        .sort(sortMatchups)
        .map((matchup, index) => {
          if (index < 9) {
            const routegod = matchup.enemy.replaceAll(" ", "_");
            let styling;
            if (matchup.winRate < 50) {
              styling = {
                opacity: ".4",
                filter: `grayscale(${100 - matchup.winRate}%)`,
              };
            }
            return (
              <div className="flex px-0.5" key={index}>
                <Link href={"/gods/".concat(routegod, "/build")}>
                  <div className="god-face" style={{ maxWidth: "100px" }}>
                    <div>
                      <Image
                        src={matchup.enemy}
                        loader={GodIconLoader}
                        width={36}
                        height={36}
                        style={styling}
                        alt={matchup.enemy}
                      />
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
