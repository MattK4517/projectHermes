import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TierListPage from "./TierListPage";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import TierListTabs from "./Tabs/TierListTabs";
import Tooltip from "@material-ui/core/Tooltip";

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
    this.props.setMatch(event.target[0].value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {" "}
        <label style={{color: "white"}}>
          Match ID:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />{" "}
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#06061f",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    border: ".5px solid gray",
    opacity: 100,
  },
}))(Tooltip);


class BaseMatchSummary extends React.Component {
  render() {
    return (
      <div className="match-summary-container" style={{minWidth: "300px"}}>
        <div className="match-info-header">
          <h3>Ranked Conquest - {this.props.matchId}<br></br>{this.props.date}</h3>
        </div>
        <div className="basic-match-info">
          <h4>Basic Match Info</h4>
          <ul>
            <li>{this.props.length} Minutes</li>
            <li>Winning Side Bans</li>
            <li className="bans-container">
              {this.props.bansWinner.map((ban) => {
                if (ban) {
                  return (
                    <Link
                      to={"/".concat(ban.replaceAll(" ", "_"))}
                    >
                      <div style={{ position: "relative" }}>
                        <div className="god-icon">
                          <div style={{ height: "30px", width: "30px" }}>
                            <img
                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${ban
                                .replaceAll(" ", "-")
                                .toLowerCase()}.jpg`}
                              alt={ban}
                              style={{
                                height: "48px",
                                width: "48px",
                                transform: "scale(0.625)",
                                transformOrigin: "0px 0px 0px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
            </li>
            <li>Loser Side Bans</li>
            <li className="bans-container">
              {this.props.bansLoser.map((ban) => {
                if (ban) {
                  return (
                    <Link
                      to={"/".concat(ban.replaceAll(" ", "_"))}
                    >
                      <div style={{ position: "relative" }}>
                        <div className="god-icon">
                          <div style={{ height: "30px", width: "30px" }}>
                            <img
                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${ban
                                .replaceAll(" ", "-")
                                .toLowerCase()}.jpg`}
                              alt={ban}
                              style={{
                                height: "48px",
                                width: "48px",
                                transform: "scale(0.625)",
                                transformOrigin: "0px 0px 0px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
            </li>
            <li>Winning Side MMR</li>
            <li>{(this.props.mmrWinner.reduce(reducer) / 5).toFixed(2) }</li>
            <li>Losing Side MMR</li>
            <li>{(this.props.mmrLoser.reduce(reducer) / 5).toFixed(2) }</li>
          </ul>
        </div>
      </div>
    );
  }
}

const Accordion = withStyles({
  root: {
    backgroundColor: "#11112a",
    padding: "2px",
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    display: "flex",
    color: "white",
    backgroundColor: "#11112a",
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const calcBuildStats = (build, base) => {
  let health = base.Health;
  let mana = base.Mana;
  let moveSpeed = base.Speed;
  let attSpeed = base.AttackSpeed;
  let magProt = base.MagicProtection;
  let physProt = base.PhysicalProtection;
  let magPower = base.MagicalPower;
  let physPower = base.PhysicalPower;
  let HP5 = base.HP5;
  let MP5 = base.MP5;
  let price = 0;
  let baseAttDamage;
  if (base.PhysicalPower > base.MagicalPower) {
    baseAttDamage = base.PhysicalPower
  } else if (base.MagicalPower > base.PhysicalPower) {
    baseAttDamage = base.MagicalPower
  }

  Object.entries(build).forEach((item) => {
    if (item[1]["DeviceName"] != undefined){
      price = price + item[1].absolutePrice;
      item[1]["ItemDescription"]["Menuitems"].map((itemStat) => {
        if (itemStat.Description.toUpperCase() == "Health".toUpperCase()) { 
          health = health + parseInt(itemStat.Value);
        } else if (itemStat.Description.toUpperCase() == "Mana".toUpperCase()) {
          mana = mana + parseInt(itemStat.Value);
        } else if (itemStat.Description.toUpperCase() == "Movement Speed".toUpperCase()){
          moveSpeed = moveSpeed + ((parseInt(itemStat.Value)/100 * base.Speed) + (18/100 * base.Speed));
        } else if (itemStat.Description.toUpperCase() == "Attack Speed".toUpperCase()){
          attSpeed = attSpeed + (parseInt(itemStat.Value) /100 * base.AttackSpeed);
        } else if (itemStat.Description.toUpperCase() == "Magical Protection".toUpperCase()) {
          magProt = magProt + parseInt(itemStat.Value)
        } else if (itemStat.Description.toUpperCase() == "Physical Protection".toUpperCase()) {
          physProt = physProt + parseInt(itemStat.Value)
        } else if (itemStat.Description.toUpperCase().includes("HP5".toUpperCase())) {
          HP5 = HP5 + parseInt(itemStat.Value)
        } else if (itemStat.Description.toUpperCase().includes("MP5".toUpperCase())) {
          MP5 = MP5 + parseInt(itemStat.Value)
        } else if (itemStat.Description.toUpperCase() == "Physical Power".toUpperCase()) {
          baseAttDamage = baseAttDamage + parseInt(itemStat.Value)
          physPower = physPower + parseInt(itemStat.Value)
        } else if (itemStat.Description.toUpperCase() == "Magical Power".toUpperCase()) {
          baseAttDamage = baseAttDamage + (parseInt(itemStat.Value) * (1/5))
          magPower = magPower + parseInt(itemStat.Value)
        }
      })
    }
  })
  return {health, mana, moveSpeed, attSpeed, magProt, physProt, magPower, physPower, HP5, MP5, baseAttDamage, price}
}

function CustomizedAccordions(player) {  
  if (player.playerName === ""){
    player.playerName = "Hidden"
  }
  let styling;
  if (player.winStatus === "Winner"){
    styling="linear-gradient(135deg,rgba(50,115,250,.2),rgba(50,115,250,0)),#191937"
  } else{
    styling="linear-gradient(135deg,rgba(255,78,80,.16),rgba(255,78,80,0)),#191937"
  }
  const {health, mana, moveSpeed, attSpeed, magProt, physProt, magPower, physPower, HP5, MP5, baseAttDamage, price} = calcBuildStats(player.godBuild, player.godStats)
  return (
      <Accordion>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" style={{background: styling}}>
            <div className="item-image" style={{minWidth: "100px"}}>
              <div className="item-image-div">
                <img
                  src={getImageUrl(player.rank)}
                  alt={player.rank}
                  style={{ maxWidth: "48px", maxHeight: "48px" }}
                />
              </div>
            </div>
            <PlayerIcon god={player.god}/>
            <div style={{minWidth: "100px"}}>
              {player.role}
            </div>
            <PlayerBuildDisplay build={player.godBuild} buildType={"items"}/>
            {/* <PlayerBuildDisplay build={player.relic} buildType={"relics"}/> */}
            <p>{player.winStatus}</p>
        </AccordionSummary>
        <AccordionDetails style={{background: styling}}>
          <div className="player-stats-breakdown" style={{minWidth: "911px", color: "white"}}>
            <div className="row">
              <div className="player-account-info" style={{minWidth: "225px"}}>
                <span className="player-info-style">Account Level:</span> {player.accountLevel} <br></br>
                <span className="player-info-style">Ranked MMR:</span> {player.mmr.toFixed(2).toLocaleString()} <br></br>
                <span className="player-info-style">Player:</span> {player.playerName}
              </div>
              <div className="player-kills-info" style={{minWidth: "200px"}}>
                <div className="KDA">
                <span className="player-info-style">KDA: </span> {player.kills} 
                  <span style={{color: "#5f5f7b"}}> / </span>
                  <span style={{color: "#ff4e50"}}>{player.deaths}</span>
                  <span style={{color: "#5f5f7b"}}> / </span>
                  {player.assists}<br></br>
                </div>
                <span className="player-info-style">Largest Killing Spree:</span>  {player.killingSpree}<br></br>
                <span className="player-info-style">Multi-Kills:</span>  {player.multiKills}
              </div>
              <div className="player-objective-info" style={{minWidth: "200px"}}>
                <span className="player-info-style">Fire Giant Kills:</span> {player.fgKills}<br></br>
                <span className="player-info-style">Gold Fury Kills:</span>  {player.gfKills}<br></br>
                <span className="player-info-style">Objective Assists:</span>  {player.objectiveAssists}
              </div>
              <div className="player-damage-info">
                <span className="player-info-style">Player Damage:</span>  {player.damagePlayer.toLocaleString()}<br></br>
                <span className="player-info-style">Damage Taken:</span>  {player.damageTaken.toLocaleString()}<br></br>
                <span className="player-info-style">Damage Mitigated:</span>  {player.damageMitigated.toLocaleString()}
              </div>
            </div>
            <div className="row">
              <div className="player-gold-info" style={{minWidth: "225px"}}>
                <span className="player-info-style">Gold:</span>  {player.gold.toLocaleString()}<br></br>
                <span className="player-info-style">Gold per Minute:</span>  {player.gpm}
              </div>
              <div className="player-healing-info" style={{minWidth: "200px"}}>
                <span className="player-info-style">Healing:</span>  {player.healing.toLocaleString()}<br></br>
                <span className="player-info-style">Self Healing:</span>  {player.selfHealing.toLocaleString()}
              </div>
              <div className="player-struct-info" style={{minWidth: "200px"}}>
                <span className="player-info-style">Tower Damage:</span>  {player.towerDamage.toLocaleString()}<br></br>
                <span className="player-info-style">Tower Kills:</span> {player.towerKills}<br></br>
                <span className="player-info-style">Phoenix Kills:</span> {player.phoenixKills}
              </div>
              <div className="player-misc-info" style={{minWidth: "200px"}}>
                <span className="player-info-style">Level:</span>  {player.level}<br></br>
                <span className="player-info-style">Skin:</span>  {player.skin}<br></br>
                <span className="player-info-style">Wards Placed:</span>  {player.wardsPlaced}<br></br>
              </div>
            </div>
            <div className="row">
              <TierListTabs>
                <div label="Build">
                  <div className="build-info" style={{minWidth: "200px"}}>
                    <span className="player-info-style">Health:</span> {health.toFixed(0)}<br></br>
                    <span className="player-info-style">Mana:</span> {mana.toFixed(0)}<br></br>
                    <span className="player-info-style">Movement Speed:</span> {moveSpeed}<br></br>
                    <span className="player-info-style">Attack Speed:</span> {attSpeed.toFixed(2)}<br></br>
                    <span className="player-info-style">Basic Attack Damage:</span> {baseAttDamage.toFixed(0)}<br></br>
                    <span className="player-info-style">Magical Protection:</span> {magProt.toFixed(0)}<br></br>
                    <span className="player-info-style">Physical Protection:</span> {physProt.toFixed(0)}<br></br>
                    <span className="player-info-style">HP5:</span> {HP5.toFixed(2)}<br></br>
                    <span className="player-info-style">MP5:</span> {MP5.toFixed(2)}<br></br>
                    <span className="player-info-style">Physical Power:</span> {physPower.toFixed(0)}<br></br>
                    <span className="player-info-style">Magical Power:</span> {magPower.toFixed(0)}<br></br>
                  </div>
                </div>
                <div label="Scoring">
                </div>
              </TierListTabs>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
  );
}

class PlayerMatchSummary extends React.Component {
    render() {
        return (
            <div className="match-summary-container-players">
                {this.props.players.map((player) => {
                  return (
                    <div className={"player-container ".concat(player.winStatus)}>
                      {CustomizedAccordions(player)}
                    </div>
                  )
                })}
            </div>
        )
    }
}

class PlayerIcon extends React.Component {
  render() {
    return (
      <div className="rt-tr god" style={{ minWidth: "155px", maxWidth: "180px", flex: "1 1 100%", display: "flex", alignContent: "center"}}>
      <Link className="player-god-played" to={"/".concat(this.props.god.replaceAll(" ", "_"))}>
        <div style={{position: "relative", minWidth: "40px"}}>
          <div className="god-icon">
            <div style={{height: "32px", width: "32px"}}>
              <img src={`https://webcdn.hirezstudios.com/smite/god-icons/${this.props.god.replaceAll(" ", "-").toLowerCase()}.jpg`} alt={this.props.god} 
              style={{ height: "32px", width: "32px", transformOrigin: "0px 0px 0px", border: "2px solid black", borderRadius: "5px" }}/>
            </div>
          </div>
        </div>
        <strong className="god-name">{this.props.god}</strong>
      </Link>
    </div>
    )
  }
}
class CreateItemToolTip extends React.Component {
  render() {
    return (
      <>
      <div
        style={{
          maxHeight: "350px",
          maxWidth: "750px",
          color: "#E6E6FA",
          alignItems: "left",
          fontSize: "14px",
        }}
      >
        <h5 style={{ width: "100%", fontSize: "1rem", color: "#1E90FF" }}>
          {this.props.item.DeviceName}
        </h5>
        <div>
          <p>{this.props.item.Description}</p>
        </div>
        <div className="item-stats">
          <div style={{marginLeft:"0px"}}>
            {this.props.item.ItemDescription.Menuitems.map(
              (stat) => {
                return (
                  <p style={{padding: "0px", margin: "0px"}}>
                    {stat.Description}: {stat.Value}
                  </p>
                );
              }
            )}
          </div>
          <br></br>
          <div className="item-passive">
            <p>{this.props.item.ItemDescription.SecondaryDescription}</p>
          </div>
        </div>
        <p style={{ color: "#D4AF37" }}>
          <b>Price:</b>{" "}
          {this.props.item.absolutePrice}(
          {this.props.item.relativePrice})
          <img
            style={{ maxHeight: "20px", maxWidth: "20px", paddingLeft: "3px" }}
            src="https://i.imgur.com/XofaIQ0.png"
            alt="gold-img"
          />
        </p>
      </div>
    </>
    );
  }
}



class PlayerBuildDisplay extends React.Component {
  render () {
    return(
      <div className={`build-container ${this.props.buildType}`}>
        {this.props.build.map((slot, index) => {
          if (slot.DeviceName) {
            return(
              <HtmlTooltip
                key={index}
                title={
                  <React.Fragment>
                    <CreateItemToolTip
                      item={slot}
                    />
                  </React.Fragment>
                }
                placement="top"
                arrow
                style={{
                  paddingRight: "10px"
                }}
                >
                <div className="item-image">
                  <div className="item-image-div">
                    <img
                      src={slot.itemIcon_URL}
                      alt={slot.DeviceName}
                      style= {{border: "2px solid black", borderRadius: "5px"}}
                    />
                  </div>
                </div>
                </HtmlTooltip>
            )
            }
        })}
      </div>
    )
  }
}

const reducer = (accumulator, currentValue) => accumulator + currentValue;

const setBans = (bans, firstSideWinStatus, setBansWinner, setBansLoser) => {
  if (firstSideWinStatus === "Winner") {
    // if first ban is winner set evens
    bans.map((ban, index) => {
      if (index % 2 === 0) {
        setBansWinner((bans) => [...bans, ban]);
      } else {
        setBansLoser((bans) => [...bans, ban]);
      }
    });
  } else {
    bans.map((ban, index) => {
      if (index % 2 === 0) {
        setBansLoser((bans) => [...bans, ban]);
      } else {
        setBansWinner((bans) => [...bans, ban]);
      }
    });
  }
};

const setMMR = (mmrs, firstSideWinStatus, setMMRWinner, setMMRLoser) => {
    if (firstSideWinStatus === "Winner") {
      // if first ban is winner set evens
      mmrs.map((mmr, index) => {
        if (index % 2 === 0) {
            setMMRWinner((mmrs) => [...mmrs, mmr]);
        } else {
            setMMRLoser((mmrs) => [...mmrs, mmr]);
        }
      });
    } else {
        mmrs.map((mmr, index) => {
        if (index % 2 === 0) {
            setMMRLoser((mmrs) => [...mmrs, mmr]);
        } else {
            setMMRWinner((mmrs) => [...mmrs, mmr]);
        }
      });
    }
  };

const normalize_rank = (tier) => {
    let rank = "Error"
    if (tier <= 5) {
        rank = "Bronze"
    } else if (tier <= 10) {
        rank = "Silver"
    } else if (tier <= 15) {
        rank = "Gold"
    } else if (tier <= 20) {
        rank = "Platinum"
    } else if (tier <= 25) {
        rank = "Diamond"
    } else if (tier == 26) {
        rank = "Masters"
    } else if (tier == 27) {
        rank = "Grandmaster"
    }
return rank
}

const getImageUrl = (rank) => {
  let url = "https://i.imgur.com/LVbUJes.png";
  if (rank == "Bronze") {
    url = "https://i.imgur.com/pNAGUeR.png";
  } else if (rank == "Silver") {
    url = "https://i.imgur.com/Cm5uf15.png";
  } else if (rank == "Gold") {
    url = "https://i.imgur.com/L3BmF9F.png";
  } else if (rank == "Platinum") {
    url = "https://i.imgur.com/6M3Ezca.png";
  } else if (rank == "Diamond") {
    url = "https://i.imgur.com/dtXd0Kv.png";
  } else if (rank == "Masters") {
    url = "https://i.imgur.com/2SdBQ4o.png";
  } else if (rank == "Grandmaster") {
    url = "https://i.imgur.com/uh3i4hc.png";
  } else if (rank == "Solo") {
    url = "https://i.imgur.com/WLU0Cel.png";
  } else if (rank == "Jungle") {
    url = "https://i.imgur.com/CyXnzEO.png";
  } else if (rank == "Mid") {
    url = "https://i.imgur.com/0oQkAAZ.png";
  } else if (rank == "Support") {
    url = "https://i.imgur.com/l7CD2QM.png";
  } else if (rank == "Carry") {
    url = "https://i.imgur.com/RlRTbrA.png";
  }
  return url;
};

function Match() {
  const [match, setMatch] = useState("");
  const [matchId, setmatchId] = useState("");
  const [matchLength, setMatchLength] = useState("");
  const [bansWinner, setBansWinner] = useState([]);
  const [bansLoser, setBansLoser] = useState([]);
  const [mmrWinner, setMMRWinner] = useState([0, 0, 0, 0, 0]);
  const [mmrLoser, setMMRLoser] = useState([0, 0, 0, 0, 0]);
  const [players, setPlayers] = useState([]);
  const [date, setMatchDate] = useState("");
  useEffect(() => {
    fetch("/getmatch/".concat(match)).then((res) =>
      res.json().then((data) => {
        setBansWinner([]);
        setBansLoser([]);
        setMMRWinner([0, 0, 0, 0, 0]);
        setMMRLoser([0, 0, 0, 0, 0]);
        setPlayers([])
        console.log(data);
        let bans = [];
        let mmrs = []
        Object.keys(data).forEach((key) => {
          if (key.includes("Ban") && key !== "First_Ban_Side") {
            bans = [...bans, data[key]];
          } else if (key.includes("player")) {
              mmrs = [...mmrs , data[key]["Ranked_Stat_Conq"]]
              setPlayers((player) => [
                ...player,
                {
                  god: data[key]["godName"],
                  rank: normalize_rank(data[key]["Conquest_Tier"]),
                  role: data[key]["Role"],
                  build: [
                    {"item": data[key]["Item_Purch_1"]},
                    {"item": data[key]["Item_Purch_2"]},
                    {"item": data[key]["Item_Purch_3"]},
                    {"item": data[key]["Item_Purch_4"]},
                    {"item": data[key]["Item_Purch_5"]},
                    {"item": data[key]["Item_Purch_6"]},
                  ],
                  relic: [
                    {"item": data[key]["Item_Active_1"]},
                    {"item": data[key]["Item_Active_2"]},
                  ],
                  accountLevel: data[key]["Account_Level"],
                  mmr: data[key]["Ranked_Stat_Conq"],
                  playerName: data[key]["Player_Name"],
                  kills: data[key]["Kills_Player"],
                  deaths: data[key]["Deaths"],
                  assists: data[key]["Assists"],
                  killingSpree: data[key]["Killing_Spree"],
                  multiKills: data[key]["Multi_kill_Max"],
                  winStatus: data[key]["Win_Status"],
                  fgKills: data[key]["Kills_Fire_Giant"],
                  gfKills: data[key]["Kills_Gold_Fury"],
                  objectiveAssists: data[key]["Objective_Assists"],
                  damagePlayer: data[key]["Damage_Player"],
                  damageTaken: data[key]["Damage_Taken"],
                  damageMitigated: data[key]["Damage_Mitigated"],
                  gold: data[key]["Gold_Earned"],
                  god: data[key]["godName"],
                  gpm: data[key]["Gold_Per_Minute"],
                  godStats: {...data[key]["godStats"]},
                  godBuild: [
                    data[key]["godBuild"]["slot1"],
                    data[key]["godBuild"]["slot2"],
                    data[key]["godBuild"]["slot3"],
                    data[key]["godBuild"]["slot4"],
                    data[key]["godBuild"]["slot5"],
                    data[key]["godBuild"]["slot6"],
                ],
                  level: data[key]["Final_Match_Level"],
                  towerDamage: data[key]["Structure_Damage"],
                  towerKills: data[key]["Towers_Destroyed"],
                  phoenixKills: data[key]["Kills_Phoenix"],
                  healing: data[key]["Healing"],
                  selfHealing: data[key]["Healing_Player_Self"],
                  skin: data[key]["Skin"],
                  wardsPlaced: data[key]["Wards_Placed"],
                }
              ])
          }
        });
        setBans(bans, data["First_Ban_Side"], setBansWinner, setBansLoser);
        setMMR(mmrs, data["First_Ban_Side"], setMMRWinner, setMMRLoser);
        setmatchId(data["MatchId"]);
        setMatchLength(data["Minutes"]);
        setMatchDate(data["Entry_Datetime"])
      })
    );
  }, [match]);

  return (
    <div className="container content-container">
      <NameForm setMatch={setMatch} />
      <div className="filler">
        <h4>
          Don't have a match? try 1191054312
        </h4>
        {/* <br></br> */}
        <h5>
          Remember all matches must by Ranked PC Conquest from 8/24/2021 or later (will expand the match types we support soon!)
        </h5>
      </div>
      <div
        className="match-container"
      >
        <BaseMatchSummary
          matchId={matchId}
          length={matchLength}
          bansWinner={bansWinner}
          bansLoser={bansLoser}
          mmrWinner={mmrWinner}
          mmrLoser={mmrLoser}
          date={date}
        />
        <PlayerMatchSummary players={players}/>
      </div>
    </div>
  );
}

export default Match;
