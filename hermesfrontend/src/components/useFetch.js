import { useState, useEffect } from "react";


const GetTopItems = (items, role) => {
  let displayItem = [];
  let allWins = [];
  Object.keys(items).forEach((item, index) => {
      allWins.push(items[item].wins);
      displayItem.push(item)
    });
    const max = Math.max(...allWins)
    return items[displayItem[allWins.indexOf(max)]]
}

const useFetch = (pagegod, role) => {
    const [games, setgames] = useState(0);
    const [banrate, setbanrate] = useState(0);
    const [pickrate, setpickrate] = useState(0);
    const [winrate, setwinrate] = useState(0);
    const [matchups, setmatchups] = useState([]);
    const [items, setitems] = useState([]);
    useEffect(() => {
        fetch("/".concat(pagegod)).then((res) =>
          res.json().then((data) => {
            console.log(data)
            setgames(data.games);
            setbanrate(((data.godBans / data.totalMatches) * 100).toFixed(2));
            setpickrate(((data.games / data.totalMatches) * 100).toFixed(2));
            setwinrate(data.wr);
            let displayItems = [];
            Object.keys(data).forEach((key) => {
              if (key === role) {
                Object.keys(data[key]).forEach((slot) => {
                  const slotMax = GetTopItems(data[key][slot])
                  displayItems.push(slotMax);
                })
              }
            });
            Object.entries(displayItems).forEach(item => {
              console.log("getting here")
              setitems((items) => [
                ...items, {
                  item: item[1].itemName,
                  games: item[1].games,
                  url: item[1].url, 
                  wins: item[1].wins
                },
              ]);
            });
          })
        );
      }, []);

      useEffect(() => {
        fetch("/".concat(pagegod, "/matchups")).then((res) =>
          res.json().then((data) => {
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
      }, []);
    return {games, banrate, pickrate, winrate, matchups, items}
};

export default useFetch;