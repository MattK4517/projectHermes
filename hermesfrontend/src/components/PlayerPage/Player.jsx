import React, { useState, useEffect } from 'react';
import PlayerHeader from './PlayerHeader';
import RankDisplay from './RankDisplay';
import GodDisplay from './GodDisplay';
import { MatchDisplay } from '..';


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
          <div className="content-section_header">
            Search for a Player
          </div>
          <form onSubmit={this.handleSubmit}>
            {" "}
            <label style={{color: "white"}}>
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

const compare = (a, b) => {
  return b.matches - a.matches
}

export default function Player(props) {
  console.log(props)
    const startPlayer = window.location.href.split("/")[5]
    const [player, setPlayer] = useState(startPlayer)
    const [playerLevel, setPlayerLevel] = useState(-1)
    const [icon, setIcon] = useState("")
    const [rank, setRank] = useState("")
    const [tier, setTier] = useState("")
    const [winRate, setWinRate] = useState("")
    const [games, setGames] = useState(0)
    const [godList, setGodList] = useState([])
    const [mode, setMode] = useState("Ranked")
    useEffect(() => {
      fetch("/api/getplayergods/".concat(player, "/", mode)).then((res) =>
        res.json().then((data) => {
          let newData = Object.values(data).sort(compare)
          setGodList([])
          setWinRate(data.winRate)
          setGames(data.games)
          Object.keys(newData).map((god, index) => {
            if (index < 10) {
              if (Object.keys(newData[god]).indexOf("god") !== -1){
              setGodList((godList) => [
                ...godList,
                {
                  ...newData[god]
                }
              ])
            }
            }
          })
        })
      );
  }, [player, mode]);
    const [matchList, setMatchList] = useState([])
    useEffect(() => {
        fetch("/api/getplayermatch/".concat(player, "/", mode)).then((res) =>
          res.json().then((data) => {
            setMatchList([])
              Object.keys(data).map((match) => {
              setMatchList((matchList) => [
                ...matchList,
                {
                  ...data[match]
                },
              ]);
            })
          })
        );
      }, [player, mode]);
    useEffect(() => {
      fetch("/api/getplayergeneral/".concat(player)).then((res) =>
        res.json().then((data) => {
            console.log(data)
            setWinRate(data.winRate)
            setGames(data.games)
            setPlayerLevel(data.level)
            setIcon(data.avatar)
            setRank(data.rank)
            setTier(data.tier ?? "")
            setGames(data.games)
        })
      );
  }, [player]);
      // <NameForm setPlayer={setPlayer} />
    return(
      <div className="player-profile-page" style={{paddingTop: "100px"}}>
        <div className="player-profile-container content-side-padding" style={{marginLeft: "auto", marginRight: "auto"}}>
          <div className="content-side-padding background-image-container">

          </div>
          <PlayerHeader player={player} level={playerLevel} icon={icon}/>
          <NameForm setPlayer={setPlayer} />
          <div className="player-content-container">
            <div className="player-content-main">
              <div className="player-side">
                <RankDisplay rank={rank} tier={tier} winrate={winRate} games={games} mode={mode}/>
                <GodDisplay godList={godList} setMode={setMode}/>
              </div>
              <div className="player-main">
                <MatchDisplay matchList={matchList} player={player} mode={mode}/>
              </div>
            </div>
          </div>
          {/* <div className="player-content-container">
            <div className="player-content-main">
              <div className="content-section">
                <div className="content-section_header">Stay Tuned For New Content!</div>
                Player Profiles and Statistics Coming Soon!
              </div>
            </div>
          </div> */}
        </div>
      </div>
    )
}