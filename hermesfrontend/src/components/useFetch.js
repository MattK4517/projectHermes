import { useState, useEffect } from "react";

const GetTopItems = (items) => {
  let displayItem = [];
  let allWins = [];
  Object.keys(items).forEach((item, index) => {
    allWins.push(items[item].wins);
    displayItem.push(item);
  });
  const max = Math.max(...allWins);
  return items[displayItem[allWins.indexOf(max)]];
};

const useFetch = (pagegod, role, rank) => {
  const [games, setgames] = useState(0);
  const [banrate, setbanrate] = useState(0);
  const [pickrate, setpickrate] = useState(0);
  const [winrate, setwinrate] = useState(0);
  const [matchups, setmatchups] = useState([]);
  const [items, setitems] = useState([]);
  const [itemdata, setitemdata] = useState([]);
  useEffect(() => {
    let mainFetchStatement;
    if (role && rank) {
      mainFetchStatement = "/".concat(pagegod, "/", role, "/", rank);
    } else if (role) {
      mainFetchStatement = "/".concat(pagegod, "/", role);
    }else {
      mainFetchStatement = "/".concat(pagegod);
    }
    fetch(mainFetchStatement).then((res) =>
      res.json().then((data) => {
        setgames(data.games);
        setbanrate(((data.godBans / data.totalMatches) * 100).toFixed(2));
        setpickrate(((data.games / data.totalMatches) * 100).toFixed(2));
        setwinrate(data.wr);
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
              item: item[1].item1.item,
              games: item[1].item1.games,
              url: item[1].item1.url,
              wins: item[1].item1.wins,
              item2: item[1].item2.item,
              games2: item[1].item2.games,
              url2: item[1].item2.url,
              wins2: item[1].item2.wins,
            },
          ]);
        });
      })
    );
  }, [role, rank]);
  // else if (role && rank){
  //   matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role, "/", rank)
  let matchupsFetchStatement;
  if (role && rank) {
    matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role, "/", rank)
  } else if (role) {
    matchupsFetchStatement = "/".concat(pagegod, "/matchups/", role)
  }else {
    matchupsFetchStatement = "/".concat(pagegod, "/matchups")
  }
  useEffect(() => {
    fetch(matchupsFetchStatement).then((res) =>
      res.json().then((data) => {
        setmatchups([])
        Object.keys(data).forEach((key) => {
          setmatchups((matchups) => [
            ...matchups,
            {
              enemy: data[key].enemy,
              timesPlayed: data[key].timesPlayed,
              url: data[key].url,
              winRate: data[key].winRate,
              wins: data[key].wins,
            },
          ]);
        });
      })
    );
  }, [role, rank]);


  return { games, banrate, pickrate, winrate, matchups, items };
};

export default useFetch;
