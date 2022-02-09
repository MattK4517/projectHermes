import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TierListPage from "./TierListPage";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import TierListTabs from "./Tabs/TierListTabs";
import Tooltip from "@material-ui/core/Tooltip";
import {
  HtmlTooltip,
  CreateItemToolTip,
} from "../components/mainGodPage/GodPageHelpers";
import PlayerCarryScore from "./MatchPage/PlayerCarryScore";

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
      <div className="content-section">
        <div className="content-section_header">Search for a Player</div>
        <form onSubmit={this.handleSubmit}>
          {" "}
          <label style={{ color: "white" }}>
            Match ID:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />{" "}
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div className="filler">
          <h4>Don't have a match? try 1202691204</h4>
          {/* <br></br> */}
          <h5>
            Remember all matches must by Ranked PC Conquest from 10/24/2021 or
            later (will expand the match types we support soon!)
          </h5>
        </div>
      </div>
    );
  }
}

function BaseMatchSummary(props) {
  return (
    <div className="match-summary-container" style={{ minWidth: "200px" }}>
      <div className="match-info-header">
        <h3>
          Ranked Conquest - {props.matchId}
          <br></br>
          {props.date}
        </h3>
      </div>
      <div className="basic-match-info">
        <h4>Basic Match Info</h4>
        <ul>
          <li>{props.length} Minutes</li>
          <li>Winning Side Bans</li>
          <li className="bans-container">
            {props.bansWinner.map((ban) => {
              if (ban) {
                return (
                  <Link to={"/".concat(ban.replaceAll(" ", "_"))}>
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
            {props.bansLoser.map((ban) => {
              if (ban) {
                return (
                  <Link to={"/".concat(ban.replaceAll(" ", "_"))}>
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
          <li>{(props.mmrWinner.reduce(reducer) / 5).toFixed(2)}</li>
          <li>Losing Side MMR</li>
          <li>{(props.mmrLoser.reduce(reducer) / 5).toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
}

const Accordion = withStyles({
  root: {
    backgroundColor: "#11112a",
    padding: "2px",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    display: "flex",
    color: "white",
    backgroundColor: "#11112a",
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export const calcBuildStats = (build, base) => {
  let health = base.Health;
  let mana = base.Mana;
  let moveSpeed = base.Speed;
  let attSpeed = base.AttackSpeed;
  let magProt = base.MagicProtection;
  let physProt = base.PhysicalProtection;
  let magPower = 0;
  let physPower = 0;
  let HP5 = base.HP5;
  let MP5 = base.MP5;
  let price = 0;
  let baseAttDamage;
  if (base.PhysicalPower > base.MagicalPower) {
    baseAttDamage = base.PhysicalPower;
  } else if (base.MagicalPower > base.PhysicalPower) {
    baseAttDamage = base.MagicalPower;
  }

  Object.entries(build).forEach((item) => {
    if (item[1]["DeviceName"] != undefined) {
      price = price + item[1].absolutePrice;
      item[1]["ItemDescription"]["Menuitems"].map((itemStat) => {
        if (itemStat.Description.toUpperCase() == "Health".toUpperCase()) {
          health = health + parseInt(itemStat.Value);
        } else if (itemStat.Description.toUpperCase() == "Mana".toUpperCase()) {
          mana = mana + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase() == "Movement Speed".toUpperCase()
        ) {
          moveSpeed =
            moveSpeed +
            ((parseInt(itemStat.Value) / 100) * base.Speed +
              (18 / 100) * base.Speed);
        } else if (
          itemStat.Description.toUpperCase() == "Attack Speed".toUpperCase()
        ) {
          attSpeed =
            attSpeed + (parseInt(itemStat.Value) / 100) * base.AttackSpeed;
        } else if (
          itemStat.Description.toUpperCase() ==
          "Magical Protection".toUpperCase()
        ) {
          magProt = magProt + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase() ==
          "Physical Protection".toUpperCase()
        ) {
          physProt = physProt + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase().includes("HP5".toUpperCase())
        ) {
          HP5 = HP5 + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase().includes("MP5".toUpperCase())
        ) {
          MP5 = MP5 + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase() == "Physical Power".toUpperCase()
        ) {
          baseAttDamage = baseAttDamage + parseInt(itemStat.Value);
          physPower = physPower + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase() == "Magical Power".toUpperCase()
        ) {
          baseAttDamage = baseAttDamage + parseInt(itemStat.Value) * (1 / 5);
          magPower = magPower + parseInt(itemStat.Value);
        } else if (
          itemStat.Description.toUpperCase() == "Price".toUpperCase()
        ) {
          price = price + parseInt(itemStat.Value) * (1 / 5);
        }
      });
    }
  });
  return {
    health,
    mana,
    moveSpeed,
    attSpeed,
    magProt,
    physProt,
    magPower,
    physPower,
    HP5,
    MP5,
    baseAttDamage,
    price,
  };
};

function CustomizedAccordions(player) {
  if (player.playerName === "") {
    player.playerName = "Hidden";
  }
  let styling;
  if (player.winStatus === "Winner") {
    styling =
      "linear-gradient(135deg,rgba(50,115,250,.2),rgba(50,115,250,0)),#191937";
  } else {
    styling =
      "linear-gradient(135deg,rgba(255,78,80,.16),rgba(255,78,80,0)),#191937";
  }
  const {
    health,
    mana,
    moveSpeed,
    attSpeed,
    magProt,
    physProt,
    magPower,
    physPower,
    HP5,
    MP5,
    baseAttDamage,
    price,
  } = calcBuildStats(player.godBuild, player.godStats);
  return (
    <Accordion>
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        style={{ background: styling }}
      >
        <div className="player-display-container ">

          <div className="player-display_mini show">
            <div className="player-display_row">
              <div className="item-image-div">
                <img
                  src={getImageUrl(player.rank)}
                  alt={player.rank}
                  style={{ minWidth: "32px", minHeight: "32px" }}
                />
              </div>
            </div>
            <div className="player-display_row">
              <Link
                className="player-god-played"
                to={"/".concat(player.god.replaceAll(" ", "_"))}
              >
                <div style={{ position: "relative", minWidth: "24px" }}>
                  <div className="player-icon">
                    <div className="player-icon_container" style={{ height: "24px", width: "24px" }}>
                      <img
                        src={`https://webcdn.hirezstudios.com/smite/god-icons/${player.god
                          .replaceAll(" ", "-")
                          .toLowerCase()}.jpg`}
                        alt={player.god}
                        style={{
                          height: "24px",
                          width: "24px",
                          transformOrigin: "0px 0px 0px",
                          border: "2px solid black",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div
            className="item-image hide"
            style={{ minWidth: "100px", alignSelf: "center" }}
          >
            <div className="item-image-div">
              <img
                src={getImageUrl(player.rank)}
                alt={player.rank}
                style={{ minWidth: "64px", minHeight: "64px" }}
              />
            </div>
          </div>
          <div className="hide">
            <PlayerIcon god={player.god} />
          </div>
          <div
            className="hide"
            style={{
              minWidth: "100px",
              alignSelf: "center",
              backgroundColor: "#11112a",
              borderRadius: "6px",
              marginRight: "3rem",
            }}
          >
            <div className="drop-down_icon">
              <div style={{ position: "relative", textAlign: "center" }}>
                <div className="god-icon">
                  <div
                    style={{
                      height: "30px",
                      width: "30px",
                    }}
                  >
                    <img
                      src={getImageUrl(player.role)}
                      alt={player.role.replaceAll("_", " ")}
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
              <strong className="god-name">
                {player.role.replaceAll("_", " ")}
              </strong>
            </div>
          </div>
        </div>
        <PlayerBuildDisplay build={player.godBuild} buildType={"items"} />
        <div className="show">
          <PlayerCarryScore player={player}/>
        </div>
        {/* <PlayerBuildDisplay build={player.relic} buildType={"relics"}/> */}
        <p>{player.winStatus}</p>
      </AccordionSummary>
      <AccordionDetails style={{ background: styling }}>
        <div
          className="player-stats-breakdown"
          style={{ minWidth: "911px", color: "white" }}
        >
          <div className="row">
            <div className="player-account-info" style={{ minWidth: "225px" }}>
              <span className="player-info-style">Account Level:</span>{" "}
              {player.accountLevel} <br></br>
              <span className="player-info-style">Ranked MMR:</span>{" "}
              {player.mmr.toFixed(2).toLocaleString()} <br></br>
              <span className="player-info-style">Player:</span>{" "}
              {player.playerName}&nbsp;
              {/* <Link
                  to={{
                    pathname: `/Player/${player.playerName}`,
                    target: "_blank"
                  }}
                >
                  <span className="player-info-style">Player:</span> {player.playerName}&nbsp;
                  <span style={{color: "#5f5f7b", fontSize: "14px", fontWeight: "400"}}> 
                    Click Me!
                  </span>
                </Link> */}
            </div>
            <div className="player-kills-info" style={{ minWidth: "200px" }}>
              <div className="KDA">
                <span className="player-info-style">KDA: </span> {player.kills}
                <span style={{ color: "#5f5f7b" }}> / </span>
                <span style={{ color: "#ff4e50" }}>{player.deaths}</span>
                <span style={{ color: "#5f5f7b" }}> / </span>
                {player.assists}
                <br></br>
              </div>
              <span className="player-info-style">Largest Killing Spree:</span>{" "}
              {player.killingSpree}
              <br></br>
              <span className="player-info-style">Multi-Kills:</span>{" "}
              {player.multiKills}
            </div>
            <div
              className="player-objective-info"
              style={{ minWidth: "200px" }}
            >
              <span className="player-info-style">Fire Giant Kills:</span>{" "}
              {player.fgKills}
              <br></br>
              <span className="player-info-style">Gold Fury Kills:</span>{" "}
              {player.gfKills}
              <br></br>
              <span className="player-info-style">Objective Assists:</span>{" "}
              {player.objectiveAssists}
            </div>
            <div className="player-damage-info">
              <span className="player-info-style">Player Damage:</span>{" "}
              {player.damagePlayer.toLocaleString()}
              <br></br>
              <span className="player-info-style">Damage Taken:</span>{" "}
              {player.damageTaken.toLocaleString()}
              <br></br>
              <span className="player-info-style">Damage Mitigated:</span>{" "}
              {player.damageMitigated.toLocaleString()}
            </div>
          </div>
          <div className="row">
            <div className="player-gold-info" style={{ minWidth: "225px" }}>
              <span className="player-info-style">Gold:</span>{" "}
              {player.gold.toLocaleString()}
              <br></br>
              <span className="player-info-style">Gold per Minute:</span>{" "}
              {player.gpm}
            </div>
            <div className="player-healing-info" style={{ minWidth: "200px" }}>
              <span className="player-info-style">Healing:</span>{" "}
              {player.healing.toLocaleString()}
              <br></br>
              <span className="player-info-style">Self Healing:</span>{" "}
              {player.selfHealing.toLocaleString()}
            </div>
            <div className="player-struct-info" style={{ minWidth: "200px" }}>
              <span className="player-info-style">Tower Damage:</span>{" "}
              {player.towerDamage.toLocaleString()}
              <br></br>
              <span className="player-info-style">Tower Kills:</span>{" "}
              {player.towerKills}
              <br></br>
              <span className="player-info-style">Phoenix Kills:</span>{" "}
              {player.phoenixKills}
            </div>
            <div className="player-misc-info" style={{ minWidth: "200px" }}>
              <span className="player-info-style">Level:</span> {player.level}
              <br></br>
              <span className="player-info-style">Skin:</span> {player.skin}
              <br></br>
              <span className="player-info-style">Wards Placed:</span>{" "}
              {player.wardsPlaced}
              <br></br>
            </div>
          </div>
          <div className="row">
            <div label="Build">
              <div className="build-info" style={{ minWidth: "200px" }}>
                <span className="player-info-style">Health:</span>{" "}
                {health.toFixed(0)}
                <br></br>
                <span className="player-info-style">Mana:</span>{" "}
                {mana.toFixed(0)}
                <br></br>
                <span className="player-info-style">Movement Speed:</span>{" "}
                {moveSpeed}
                <br></br>
                <span className="player-info-style">Attack Speed:</span>{" "}
                {attSpeed.toFixed(2)}
                <br></br>
                <span className="player-info-style">
                  Basic Attack Damage:
                </span>{" "}
                {baseAttDamage.toFixed(0)}
                <br></br>
                <span className="player-info-style">
                  Magical Protection:
                </span>{" "}
                {magProt.toFixed(0)}
                <br></br>
                <span className="player-info-style">
                  Physical Protection:
                </span>{" "}
                {physProt.toFixed(0)}
                <br></br>
                <span className="player-info-style">HP5:</span> {HP5.toFixed(2)}
                <br></br>
                <span className="player-info-style">MP5:</span> {MP5.toFixed(2)}
                <br></br>
                <span className="player-info-style">Physical Power:</span>{" "}
                {physPower.toFixed(0)}
                <br></br>
                <span className="player-info-style">Magical Power:</span>{" "}
                {magPower.toFixed(0)}
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

function PlayerMatchSummary(props) {
  return (
    <div className="match-summary-container-players">
      {props.players.map((player) => {
        return (
          <div className={"player-container ".concat(player.winStatus)}>
            {CustomizedAccordions(player)}
          </div>
        );
      })}
    </div>
  );
}

function PlayerIcon(props) {
  return (
    <div
      className="rt-tr god"
      style={{
        minWidth: "155px",
        maxWidth: "160px",
        flex: "1 1 100%",
        display: "flex",
        alignContent: "center",
      }}
    >
      <Link
        className="player-god-played"
        to={"/".concat(props.god.replaceAll(" ", "_"))}
      >
        <div style={{ position: "relative", minWidth: "40px" }}>
          <div className="god-icon">
            <div style={{ height: "48px", width: "48px" }}>
              <img
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.god
                  .replaceAll(" ", "-")
                  .toLowerCase()}.jpg`}
                alt={props.god}
                style={{
                  height: "48px",
                  width: "48px",
                  transformOrigin: "0px 0px 0px",
                  border: "2px solid black",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        </div>
        <strong className="god-name" style={{ marginLeft: ".75rem" }}>
          {props.god}
        </strong>
      </Link>
    </div>
  );
}

export function PlayerBuildDisplay(props) {
  return (
    <div className="items-match">
      <div
        className="build"
        style={{
          marginTop: "0px",
          backgroundColor: "#11112a",
          display: "flex",
        }}
      >
        <div className="build-container">
          {props.build.map((slot, index) => {
            if (slot.DeviceName) {
              return (
                // <HtmlTooltip
                //   key={index}
                //   title={
                //     <React.Fragment>
                //       <CreateItemToolTip item={slot} />
                //     </React.Fragment>
                //   }
                //   placement="top"
                //   arrow
                //   style={{
                //     paddingRight: "10px",
                //   }}
                // >
                <div
                  className="item-wrapper"
                  style={{ width: "36px", height: "36px" }}
                >
                  <div class="item-image_container" style={{ width: "36px", height: "36px" }}>
                    <img
                      style={{
                        height: "72px",
                        width: "72px",
                        backgroundPosition: "-96px -96px",
                        transform: "scale(0.5)",
                        transformOrigin: "0px 0px 0px",
                      }}
                      src={`https://webcdn.hirezstudios.com/smite/item-icons/${slot.DeviceName.replaceAll(
                        " ",
                        "-"
                      )
                        .replaceAll("'", "")
                        .toLowerCase()}.jpg`}
                      alt={slot.DeviceName}
                    />
                  </div>
                </div>
                //</HtmlTooltip>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
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
  let rank = "Error";
  if (tier <= 5) {
    rank = "Bronze";
  } else if (tier <= 10) {
    rank = "Silver";
  } else if (tier <= 15) {
    rank = "Gold";
  } else if (tier <= 20) {
    rank = "Platinum";
  } else if (tier <= 25) {
    rank = "Diamond";
  } else if (tier == 26) {
    rank = "Masters";
  } else if (tier == 27) {
    rank = "Grandmaster";
  }
  return rank;
};

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
  } else if (rank == "Casual") {
    url = "https://i.imgur.com/bVKJ1Az.png";
  }
  return url;
};

function Match() {
  const startMatchId = window.location.href.split("/")[5];
  const [match, setMatch] = useState(startMatchId);
  const [matchId, setmatchId] = useState("");
  const [matchLength, setMatchLength] = useState("");
  const [bansWinner, setBansWinner] = useState([]);
  const [bansLoser, setBansLoser] = useState([]);
  const [mmrWinner, setMMRWinner] = useState([0, 0, 0, 0, 0]);
  const [mmrLoser, setMMRLoser] = useState([0, 0, 0, 0, 0]);
  const [players, setPlayers] = useState([]);
  const [date, setMatchDate] = useState("");

  useEffect(() => {
    fetch("/api/getmatch/".concat(match)).then((res) =>
      res.json().then((data) => {
        setBansWinner([]);
        setBansLoser([]);
        setMMRWinner([0, 0, 0, 0, 0]);
        setMMRLoser([0, 0, 0, 0, 0]);
        setPlayers([]);
        let bans = [];
        let mmrs = [];
        Object.keys(data).forEach((key) => {
          if (key.includes("Ban") && key !== "First_Ban_Side") {
            bans = [...bans, data[key]];
          } else if (key.includes("player")) {
            mmrs = [...mmrs, data[key]["Ranked_Stat_Conq"]];
            setPlayers((player) => [
              ...player,
              {
                god: data[key]["godName"],
                rank: normalize_rank(data[key]["Conquest_Tier"]),
                role: data[key]["Role"],
                build: [
                  { item: data[key]["Item_Purch_1"] },
                  { item: data[key]["Item_Purch_2"] },
                  { item: data[key]["Item_Purch_3"] },
                  { item: data[key]["Item_Purch_4"] },
                  { item: data[key]["Item_Purch_5"] },
                  { item: data[key]["Item_Purch_6"] },
                ],
                relic: [
                  { item: data[key]["Item_Active_1"] },
                  { item: data[key]["Item_Active_2"] },
                ],
                accountLevel: data[key]["Account_Level"],
                mmr: data[key]["Ranked_Stat_Conq"],
                playerName: data[key]["Player_Name"],
                kills: data[key]["Kills_Player"],
                Kills_Double: data[key]["Kills_Double"],
                Kills_Triple: data[key]["Kills_Triple"],
                Kills_Quadra: data[key]["Kills_Quadra"],
                Kills_Penta: data[key]["Kills_Penta"],
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
                godStats: { ...data[key]["godStats"] },
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
                // carryScore: data["carryScore"][data[key]["Win_Status"]][data[key]["Role"]]["goldShare"],
                damageScore:
                  data["damageScore"][data[key]["Win_Status"]][
                    data[key]["Role"]
                  ]["damageShare"],
                killPart:
                  data["killPart"][data[key]["Win_Status"]][data[key]["Role"]][
                    "killShare"
                  ],
                goldScore:
                  data["goldScore"][data[key]["Win_Status"]][data[key]["Role"]][
                    "goldShare"
                  ],
              },
            ]);
          }
        });
        setBans(bans, data["First_Ban_Side"], setBansWinner, setBansLoser);
        setMMR(mmrs, data["First_Ban_Side"], setMMRWinner, setMMRLoser);
        setmatchId(data["MatchId"]);
        setMatchLength(data["Minutes"]);
        setMatchDate(data["Entry_Datetime"]);
      })
    );
  }, [match]);

  return (
    <div
      className="container content-container"
      style={{ maxWidth: "fit-content" }}
    >
      <NameForm setMatch={setMatch} />
      <div className="content-section" style={{ marginTop: "36px" }}>
        <div className="content-section_header">
          Match Summary&nbsp;
          <span
            style={{ color: "#5f5f7b", fontSize: "14px", fontWeight: "400" }}
          >
            Click on players to see thier performance
          </span>
        </div>
        <div className="match-container">
          <BaseMatchSummary
            matchId={matchId}
            length={matchLength}
            bansWinner={bansWinner}
            bansLoser={bansLoser}
            mmrWinner={mmrWinner}
            mmrLoser={mmrLoser}
            date={date}
          />
          <PlayerMatchSummary players={players} />
        </div>
      </div>
    </div>
  );
}

export default Match;
