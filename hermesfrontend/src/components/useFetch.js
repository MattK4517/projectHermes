import { useState, useEffect } from "react";
import winRateColor from "./mainGodPage/WinRateColor";

const compare = (a, b) => {
  return a.winRate - b.winRate
}

const useFetch = (pagegod, role, rank, patch, matchup, queue_type) => {
  const [games, setgames] = useState(0);
  // const [banrate, setbanrate] = useState(0);
  // const [pickrate, setpickrate] = useState(0);
  // const [winrate, setwinrate] = useState(0);
  const [badmatchups, setbadmatchups] = useState([]);
  const [goodmatchups, setgoodmatchups] = useState([]);
  const [items, setitems] = useState([]);
  const [relics, setRelics] = useState([]);
  const [colorStyle, setColorStyle] = useState("white");
  useEffect(() => {
    let mainFetchStatement = "/api/".concat(pagegod, "/", role, "/", rank, "/", patch, "/", queue_type);
    if (matchup !== "None"){
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
          if (item[1].item1.item && item[1].item2.item){
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
          if (item[1].item1.item && item[1].item2.item){
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

  }, [role, rank, patch, matchup, queue_type]);
  // else if (role && rank){
  //   matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role, "/", rank)
  let matchupsFetchStatement = "/api/".concat(pagegod, "/matchups/", role, "/", rank, "/", patch, "/", queue_type)
  useEffect(() => {
    fetch(matchupsFetchStatement).then((res) =>
      res.json().then((data) => {
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
                timesPlayed: newData[god].timesPlayed,
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
                timesPlayed: newData[god].timesPlayed,
                url: newData[god].url,
                winRate: newData[god].winRate,
                wins: newData[god].wins,
              },
            ]);
          }
        });
      })
    );
  }, [role, rank, patch, queue_type]);

  return { games, badmatchups, goodmatchups, items, colorStyle, relics };
  // return { games, banrate, pickrate, winrate, badmatchups, goodmatchups, items, colorStyle };
};

export default useFetch;
