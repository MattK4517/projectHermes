import React, { useState, useEffect, useContext } from "react";
import PlayerHeader from "./PlayerHeader";
import RankDisplay from "./RankDisplay";
import GodDisplay from "./GodDisplay";
import { MatchDisplay } from "..";
import { PlayerContext } from "./PlayerContext";
import PlayerTabs from "./PlayerTabs";
import "./Player.css";
import { GiModernCity } from "react-icons/gi";

export const linkDict = {
  Achilles: "https://i.imgur.com/KoU1bup.jpg",
  Agni: "https://i.imgur.com/DNzygMe.jpg",
  "Ah Muzen Cab": "https://i.imgur.com/mAPxdzA.jpg",
  "Ah Puch": "https://i.imgur.com/xX16VcU.jpg",
  Amaterasu: "https://i.imgur.com/HcxQ8sd.jpg",
  Anhur: "https://i.imgur.com/c4ex2dq.jpg",
  Anubis: "https://i.imgur.com/CuZgOab.jpg",
  "Ao Kuang": "https://i.imgur.com/0n7LLuG.jpg",
  Aphrodite: "https://i.imgur.com/AaDJFPx.jpg",
  Apollo: "https://i.imgur.com/MTnDzUl.jpg",
  Arachne: "https://i.imgur.com/3kjOdcl.jpg",
  Ares: "https://i.imgur.com/DBcm5f7.jpg",
  Artemis: "https://i.imgur.com/bT4b5gc.jpg",
  Artio: "https://i.imgur.com/pwTJrq3.jpg",
  Athena: "https://i.imgur.com/8uCHDlz.jpg",
  Atlas: "https://i.imgur.com/uCMJ541.jpg",
  Awilix: "https://i.imgur.com/fZh25Mc.jpg",
  "Baba Yaga": "https://i.imgur.com/6tquTDY.jpg",
  Bacchus: "https://i.imgur.com/lL8RPfw.jpg",
  Bakasura: "https://i.imgur.com/5gIjFo9.jpg",
  "Baron Samedi": "https://i.imgur.com/cChes0b.jpg",
  Bastet: "https://i.imgur.com/N7gykrw.jpg",
  Bellona: "https://i.imgur.com/i1r4nt4.jpg",
  Cabrakan: "https://i.imgur.com/HmMYUJU.jpg",
  Camazotz: "https://i.imgur.com/DXY2jSE.jpg",
  Cerberus: "https://i.imgur.com/9s5zFdr.jpg",
  Cernunnos: "https://i.imgur.com/IquJH93.jpg",
  Chaac: "https://i.imgur.com/slznuZW.jpg",
  "Chang'e": "https://i.imgur.com/nTVHD0y.jpg",
  Charybdis: "https://i.imgur.com/AGvDlVi.jpg",
  Chernobog: "https://i.imgur.com/8zvnYu5.jpg",
  Chiron: "https://i.imgur.com/cEygNc6.jpg",
  Chronos: "https://i.imgur.com/4CZSIPa.jpg",
  Cliodhna: "https://i.imgur.com/PD9N9pl.jpg",
  Cthulhu: "https://i.imgur.com/3iKo30i.jpg",
  "Cu Chulainn": "https://i.imgur.com/4eFDG0e.jpg",
  Cupid: "https://i.imgur.com/OLY1TDP.jpg",
  "Da Ji": "https://i.imgur.com/oJpXD2R.jpg",
  Danzaburou: "https://i.imgur.com/PeLPV06.jpg",
  Discordia: "https://i.imgur.com/bTwDxKV.jpg",
  "Erlang Shen": "https://i.imgur.com/nlcwZ2T.jpg",
  Eset: "https://i.imgur.com/BjXX0Wi.png",
  Fafnir: "https://i.imgur.com/43Yhg9Q.jpg",
  Fenrir: "https://i.imgur.com/S8lzwSw.jpg",
  Freya: "https://i.imgur.com/NSDIXDa.jpg",
  Ganesha: "https://i.imgur.com/WgM5ytq.jpg",
  Geb: "https://i.imgur.com/yjoLvUY.jpg",
  Gilgamesh: "https://i.imgur.com/grBatk2.jpg",
  "Guan Yu": "https://i.imgur.com/NeDl0HH.jpg",
  Hachiman: "https://i.imgur.com/JydMpnq.jpg",
  Hades: "https://i.imgur.com/giljWP0.jpg",
  "He Bo": "https://i.imgur.com/467ruyn.jpg",
  Heimdallr: "https://i.imgur.com/AWpOHTw.jpg",
  Hel: "https://i.imgur.com/KLeqa2y.jpg",
  Hera: "https://i.imgur.com/P6S6Tyc.jpg",
  Hercules: "https://i.imgur.com/RWqvXi9.jpg",
  Horus: "https://i.imgur.com/mA0Vom6.jpg",
  "Hou Yi": "https://i.imgur.com/AnJgIRB.jpg",
  "Hun Batz": "https://i.imgur.com/PWS1kZ3.jpg",
  Izanami: "https://i.imgur.com/t5c7f2K.jpg",
  Janus: "https://i.imgur.com/RPotbAL.jpg",
  "Jing Wei": "https://i.imgur.com/eaJX1IP.jpg",
  Jormungandr: "https://i.imgur.com/8COqM2r.jpg",
  Kali: "https://i.imgur.com/XVWHFVt.jpg",
  Khepri: "https://i.imgur.com/mQrlTRL.jpg",
  "King Arthur": "https://i.imgur.com/EUcSN1c.jpg",
  Kukulkan: "https://i.imgur.com/QWD7oco.jpg",
  Kumbhakarna: "https://i.imgur.com/qgFK672.jpg",
  Kuzenbo: "https://i.imgur.com/efIAMWB.jpg",
  Loki: "https://i.imgur.com/vmiaaRh.jpg",
  Medusa: "https://i.imgur.com/ilPujED.jpg",
  Mercury: "https://i.imgur.com/P7CJ5UQ.jpg",
  Merlin: "https://i.imgur.com/abi67RB.jpg",
  "Morgan Le Fay": "https://i.imgur.com/QZ4jZjU.jpg",
  Mulan: "https://i.imgur.com/ZiNzuWe.jpg",
  "Ne Zha": "https://i.imgur.com/Sl4glQA.jpg",
  Neith: "https://i.imgur.com/IFI8nNw.jpg",
  Nemesis: "https://i.imgur.com/e3CNDNb.jpg",
  Nike: "https://i.imgur.com/mkkL7qX.jpg",
  Nox: "https://i.imgur.com/u6ra0GF.jpg",
  "Nu Wa": "https://i.imgur.com/VhCooqS.jpg",
  Odin: "https://i.imgur.com/VBaP7Vz.jpg",
  Olorun: "https://i.imgur.com/7jYk5RU.jpg",
  Osiris: "https://i.imgur.com/7JqDGsP.jpg",
  Pele: "https://i.imgur.com/l5q55hc.jpg",
  Persephone: "https://i.imgur.com/rK8EpOK.jpg",
  Poseidon: "https://i.imgur.com/kvNTrf3.jpg",
  Ra: "https://i.imgur.com/vipeJLL.jpg",
  Raijin: "https://i.imgur.com/qwQnQyT.jpg",
  Rama: "https://i.imgur.com/4ebZjis.jpg",
  Ratatoskr: "https://i.imgur.com/rFfc7dB.jpg",
  Ravana: "https://i.imgur.com/kKfiIrt.jpg",
  Scylla: "https://i.imgur.com/7NPNf46.jpg",
  Serqet: "https://i.imgur.com/9odFATg.jpg",
  Set: "https://i.imgur.com/7hjbLls.jpg",
  Shiva: "https://i.imgur.com/wH3klnZ.jpg",
  Skadi: "https://i.imgur.com/097p6i9.jpg",
  Sobek: "https://i.imgur.com/LIU5dYN.png",
  Sol: "https://i.imgur.com/H6PFyOw.jpg",
  "Sun Wukong": "https://i.imgur.com/fkQAznu.jpg",
  Susano: "https://i.imgur.com/iYwz8M7.jpg",
  Sylvanus: "https://i.imgur.com/1yR9had.jpg",
  Terra: "https://i.imgur.com/0PBRilP.jpg",
  Thanatos: "https://i.imgur.com/6acnOIq.jpg",
  "The Morrigan": "https://i.imgur.com/lX1FsDS.jpg",
  Thor: "https://i.imgur.com/dYIPSkM.jpg",
  Thoth: "https://i.imgur.com/l6NYsol.jpg",
  Tiamat: "https://i.imgur.com/XFyqECN.jpg",
  Tsukuyomi: "https://i.imgur.com/YntBuSV.jpg",
  Tyr: "https://i.imgur.com/OZ43lHw.jpg",
  Ullr: "https://i.imgur.com/pzKIi3p.jpg",
  Vamana: "https://i.imgur.com/RYo9mkm.jpg",
  Vulcan: "https://i.imgur.com/uGt5yTN.jpg",
  Xbalanque: "https://i.imgur.com/Ny89l8l.jpg",
  "Xing Tian": "https://i.imgur.com/EPD67l6.jpg",
  Yemoja: "https://i.imgur.com/N3MPZdc.jpg",
  Ymir: "https://i.imgur.com/QajyfQZ.jpg",
  Zeus: "https://i.imgur.com/M6EUYxz.jpg",
  "Zhong Kui": "https://i.imgur.com/aJBjZJE.jpg",
};

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    this.props.setPlayer(event.target[0].value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="content-section">
        <div className="content-section_header">Search for a Player</div>
        <form onSubmit={this.handleSubmit}>
          {" "}
          <label style={{ color: "white" }}>
            Player Name:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />{" "}
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

const parsePlayer = (data, mode, inputType) => {
  console.log(data);
  let rank = 0;
  let seasonGames = 0;
  let seasonWinRate = 0;
  console.log(`Ranked${mode}`);
  if (inputType === "KBM") {
    seasonGames =
      data[`Ranked${mode}`]["Wins"] + data[`Ranked${mode}`]["Losses"];
    rank = data[`Ranked${mode}`]["Tier"];
    seasonWinRate =
      data[`Ranked${mode}`]["Wins"] /
      (data[`Ranked${mode}`]["Wins"] + data[`Ranked${mode}`]["Losses"]);
  } else if (inputType === "Controller") {
    seasonGames =
      data[`Ranked${mode}${inputType}`]["Wins"] +
      data[`Ranked${mode}${inputType}`]["Losses"];
    rank = data[`Ranked${mode}${inputType}`]["Tier"];
    seasonWinRate =
      data[`Ranked${mode}${inputType}`]["Wins"] /
      (data[`Ranked${mode}${inputType}`]["Wins"] +
        data[`Ranked${mode}${inputType}`]["Losses"]);
  }
  return { rank, seasonGames, seasonWinRate };
};

const compare = (a, b) => {
  return b.matches - a.matches;
};

const compareDate = (a, b) => {
  return b.MatchId - a.MatchId;
};

export const setTopGod = (god) => {
  return linkDict[god];
};
export default function Player(props) {
  const [
    god,
    setGod,
    player,
    setPlayer,
    queueType,
    setQueueType,
    role,
    setRole,
    topLink,
    setTopLink,
    icon,
    setIcon,
    playerLevel,
    setPlayerLevel,
    tab,
    setTab,
    patch,
    setPatch,
    patches,
    mode,
    setMode,
    queueTypes,
    modes,
    inputType,
    setInputType,
    inputTypes,
  ] = useContext(PlayerContext);
  setPlayer(window.location.href.split("/")[5]);

  const [rank, setRank] = useState("");
  const [tier, setTier] = useState("");
  const [winRate, setWinRate] = useState("");
  const [games, setGames] = useState(0);
  const [seasonWinRate, setSeasonWinRate] = useState("");
  const [seasonGames, setSeasonGames] = useState(0);
  const [godList, setGodList] = useState([]);
  useEffect(() => {
    if (queueTypes.indexOf(player) === -1) {
      fetch(
        "/api/getplayergods/".concat(
          player,
          "/",
          queueType,
          "/",
          mode,
          "/",
          inputType
        )
      ).then((res) =>
        res.json().then((data) => {
          setGames(data.games);
          setWinRate(data.winRate);
          delete data.games;
          delete data.winRate;
          let newData = Object.values(data).sort(compare);

          setGodList([]);
          Object.keys(newData).map((god, index) => {
            if (index === 0) {
              setTopLink(setTopGod(newData[index]["god"]));
            }
            if (index < 10) {
              if (Object.keys(newData[god]).indexOf("god") !== -1) {
                setGodList((godList) => [
                  ...godList,
                  {
                    ...newData[god],
                  },
                ]);
              }
            }
          });
        })
      );
    }
  }, [player, mode, queueType, inputType]);
  const [matchList, setMatchList] = useState([]);

  useEffect(() => {
    fetch(
      "/api/getplayermatch/".concat(
        player,
        "/",
        queueType,
        "/",
        patch,
        "/",
        mode
      )
    ).then((res) =>
      res.json().then((data) => {
        setMatchList([]);
        let newData = Object.values(data).sort(compareDate);
        Object.keys(newData).map((match) => {
          setMatchList((matchList) => [
            ...matchList,
            {
              ...newData[match],
            },
          ]);
        });
      })
    );
  }, [player, queueType, patch, mode, inputType]);

  useEffect(() => {
    fetch("/api/getplayergeneral/".concat(player)).then((res) =>
      res.json().then((data) => {
        console.log(data);
        let newData = parsePlayer(data, mode, inputType);
        setSeasonGames(newData.seasonGames);
        setSeasonWinRate((newData.seasonWinRate * 100).toFixed(2));
        setPlayerLevel(data.Level);
        if (data.Avatar_URL !== "") {
          setIcon(data.Avatar_URL);
        }
        setRank(newData.rank);
        setTier(newData.rank);
      })
    );
  }, [player, mode, inputType]);

  // <NameForm setPlayer={setPlayer} />
  return (
    <div className="content">
      <div className="player-profile-page">
        <div
          className="player-profile-container content-side-padding"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="content-side-padding background-image-container">
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div class="bg-container">
                <img class="background-image" src={topLink} />
              </div>
              <div class="gradient-container">
                <div class="gradient"></div>
              </div>
            </div>
          </div>
          {/* <NameForm setPlayer={setPlayer} /> */}
          <PlayerHeader player={player} level={playerLevel} icon={icon} />
          <div className="player-tab-header">
            <div className="player-tab-container">
              <PlayerTabs />
            </div>
          </div>
          <div className="player-content-container">
            <div className="player-content-main">
              <div className="player-side" style={{ minWidth: "315px" }}>
                <RankDisplay
                  rank={rank}
                  tier={tier}
                  winrate={winRate}
                  games={games}
                  queueType={queueType}
                  seasonGames={seasonGames}
                  seasonWinRate={seasonWinRate}
                />
                <GodDisplay godList={godList} player={player} />
              </div>
              <div className="player-main">
                <MatchDisplay
                  matchList={matchList}
                  player={player}
                  queueType={queueType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
