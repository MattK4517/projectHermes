import { useState, useEffect } from "react";
import winRateColor from "./mainGodPage/WinRateColor";
import { useQuery } from 'react-query';

const compare = (a, b) => {
  return a.winRate - b.winRate
}

const useFetch = (pagegod, role, rank, patch, matchup, queueType, mode) => {
  // console.log(pagegod, role, rank, patch, matchup, queueType, mode)
  const [games, setgames] = useState(0);
  // const [banrate, setbanrate] = useState(0);
  // const [pickrate, setpickrate] = useState(0);
  // const [winrate, setwinrate] = useState(0);
  const [badmatchups, setbadmatchups] = useState([]);
  const [goodmatchups, setgoodmatchups] = useState([]);
  const [items, setitems] = useState([]);
  const [relics, setRelics] = useState([]);
  const [colorStyle, setColorStyle] = useState("white");
  const buildData = useQuery(
    ['godpage-build', role, rank, patch, queueType, mode],
    () => {
      let mainFetchStatement = "/api/".concat(pagegod, "/", role, "/", rank, "/", patch, "/", queueType, "/", mode);
      if (matchup !== "None") {
        mainFetchStatement = mainFetchStatement.concat("/", matchup)
      }
      fetch(mainFetchStatement).then((res) =>
        res.json().then((data) => {
          setgames(data.games);
          // setbanrate(((data.godBans / data.totalMatches) * 100).toFixed(2));
          // setpickrate(((data.games / data.totalMatches) * 100).toFixed(2));
          // setwinrate(data.winRate);
          setColorStyle(winRateColor(data.winRate))
          let displayItems = [];
          let displayRelics = [];
          Object.keys(data).forEach((key) => {
            if (key.startsWith("slot")) {
              displayItems.push(data[key]);
            }
            else if (key.startsWith("relic")) {
              displayRelics.push(data[key]);
            }
          });
          setitems([])
          setRelics([])
          Object.entries(displayItems).forEach((item) => {
            if (item[1].item1.item && item[1].item2.item) {
              setitems((items) => [
                ...items,
                {
                  item: {
                    ...item[1].item1
                  },
                  item2: {
                    ...item[1].item2
                  },
                }
              ]);
            }
          });
          Object.entries(displayRelics).forEach((item) => {
            if (item[1].item1.item && item[1].item2.item) {
              setRelics((relics) => [
                ...relics,
                {
                  item: {
                    ...item[1].item1
                  },
                  item2: {
                    ...item[1].item2
                  },
                }
              ]);
            }
          });
        })
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  // else if (role && rank){
  //   matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role, "/", rank)
  const matchupData = useQuery(
    ['godpage-matchups', role, rank, patch, queueType, matchup, mode],
    () => {
      let matchupsFetchStatement = "/api/".concat(pagegod, "/matchups/", role, "/", rank, "/", patch, "/", queueType, "/", mode)
      fetch(matchupsFetchStatement).then((res) =>
        res.json().then((data) => {
          console.log("DATA", data)
          Object.values(data).sort(compare)
          let newData = Object.values(data).sort(compare)
          setbadmatchups([])
          setgoodmatchups([])
          Object.keys(newData).map((god, index) => {
            if (index < 10) {
              setbadmatchups((badmatchups) => [
                ...badmatchups,
                {
                  enemy: newData[god].enemy,
                  games: newData[god].games,
                  url: newData[god].url,
                  winRate: newData[god].winRate,
                  wins: newData[god].wins,
                },
              ]);
            } else if (newData.length - index < 9) {
              setgoodmatchups((goodmatchups) => [
                ...goodmatchups,
                {
                  enemy: newData[god].enemy,
                  games: newData[god].games,
                  url: newData[god].url,
                  winRate: newData[god].winRate,
                  wins: newData[god].wins,
                },
              ]);
            }
          });
        })
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return { games, badmatchups, goodmatchups, items, colorStyle, relics };
  // return { games, banrate, pickrate, winrate, badmatchups, goodmatchups, items, colorStyle };
};

export default useFetch;
