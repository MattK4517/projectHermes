import { useState, useEffect } from "react";
import winRateColor from "./mainGodPage/WinRateColor";

const compare = (a, b) => {
  return a.winRate - b.winRate
}

const useFetch = (pagegod, role, rank, patch) => {
  const [games, setgames] = useState(0);
  // const [banrate, setbanrate] = useState(0);
  // const [pickrate, setpickrate] = useState(0);
  // const [winrate, setwinrate] = useState(0);
  const [badmatchups, setbadmatchups] = useState([]);
  const [goodmatchups, setgoodmatchups] = useState([]);
  const [items, setitems] = useState([]);
  const [colorStyle, setColorStyle] = useState("white");
  const [itemdata, setitemdata] = useState([]);
  useEffect(() => {
    let mainFetchStatement = "/".concat(pagegod, "/", role, "/", rank, "/", patch);
    fetch(mainFetchStatement).then((res) =>
      res.json().then((data) => {
        setgames(data.games);
        // setbanrate(((data.godBans / data.totalMatches) * 100).toFixed(2));
        // setpickrate(((data.games / data.totalMatches) * 100).toFixed(2));
        // setwinrate(data.winRate);
        setColorStyle(winRateColor(data.winRate))
        let displayItems = [];
        Object.keys(data).forEach((key) => {
          if (key.startsWith("slot")) {
            displayItems.push(data[key]);
          }
        });
        setitems([])
        Object.entries(displayItems).forEach((item) => {
          setitems((items) => [
            ...items,
            {
              item: {
                item: item[1].item1.item,
                games: item[1].item1.games,
                url: item[1].item1.url,
                wins: item[1].item1.wins,
                itemShortDesc: item[1].item1.ShortDesc,
                itemAbsolutePrice: item[1].item1.absolutePrice,
                itemRelativePrice: item[1].item1.relativePrice,
                itemPassive: item[1].item1.ItemDescription.SecondaryDescription,
                itemStats: item[1].item1["itemStats"].map((stat) => {
                  return [stat.Description, stat.Value];
                }),
              },
              item2: {
                item: item[1].item2.item,
                games: item[1].item2.games,
                url: item[1].item2.url,
                wins: item[1].item2.wins,
                itemShortDesc: item[1].item2.ShortDesc,
                itemAbsolutePrice: item[1].item2.absolutePrice,
                itemRelativePrice: item[1].item2.relativePrice,
                itemPassive: item[1].item2.ItemDescription.SecondaryDescription,
                itemStats: item[1].item2["itemStats"].map((stat) => {
                  return [stat.Description, stat.Value];
                }),
              },
            }
          ]);
        });
      })
    );

  }, [role, rank, patch]);
  // else if (role && rank){
  //   matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role, "/", rank)
  let matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role, "/", rank, "/", patch)
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
          } else if (newData.length - index < 11) {
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
  }, [role, rank, patch]);

  return { games, badmatchups, goodmatchups, items, colorStyle };
  // return { games, banrate, pickrate, winrate, badmatchups, goodmatchups, items, colorStyle };
};

export default useFetch;
