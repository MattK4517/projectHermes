import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { IMatch, IPlayer } from "./MatchInterface";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
import { parseMatchData } from "./MatchHelpers";
import { DataRow } from "../mainGodPage/Skins/SkinStatPage";
import PlayerMatchDisplay from "./PlayerMatchDisplay";

import TierListPage from "../TierListPage";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";

import { HtmlTooltip, CreateItemToolTip } from "../mainGodPage/GodPageHelpers";

import Typography from "@material-ui/core/Typography";
import TierListTabs from "../Tabs/TierListTabs";
import Tooltip from "@material-ui/core/Tooltip";
import PlayerCarryScore from "./PlayerCarryScore";
import BaseMatchSummary from "./BaseMatchSummary";
import { fontWeight } from "@mui/system";
import MultiKillDisplay from "../PlayerPage/MultiKillDisplay";
import { GetCarryPlayer } from "./MatchHelpers";
import DamageOut from "../DmgCalcPage/DamageOut";
import { calcKDA } from "../PlayerPage/GodDisplay";

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

export function PlayerBuildDisplay({ player }: { player: IPlayer }) {
  return (
    <div className="items-match">
      <div
        className="build"
        style={{
          marginTop: "0px",
          backgroundColor: "#11112a",
          display: "flex",
          height: "100%",
        }}
      >
        <div className="build-container">
          {player.godBuild.map((slot: any, index: number) => {
            if (slot.DeviceName) {
              return (
                <HtmlTooltip
                  key={index}
                  title={
                    <React.Fragment>
                      <CreateItemToolTip item={slot} />
                    </React.Fragment>
                  }
                  placement="top"
                  arrow
                  style={{
                    paddingRight: "10px",
                  }}
                >
                  <div
                    className="item-wrapper"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <div
                      className="item-image_container"
                      style={{ width: "36px", height: "36px" }}
                    >
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
                </HtmlTooltip>
              );
            }
          })}
        </div>
      </div>
      <div
        className="KDA show"
        style={{
          flexDirection: "row",
          width: "100%",
        }}
      >
        <span className="player-info-style">KDA: </span> {player.Kills_Player}
        <span style={{ color: "#5f5f7b" }}> / </span>
        <span style={{ color: "#ff4e50" }}>{player.Deaths}</span>
        <span style={{ color: "#5f5f7b" }}> / </span>
        {player.Assists}
        <br></br>
      </div>
      <div className="show">
        <MultiKillDisplay player={player} />
      </div>
    </div>
  );
}

function CustomizedAccordions(player: IPlayer) {
  if (player.Player_Name === "") {
    player.Player_Name = "Hidden";
  }
  let styling;
  if (player.Win_Status === "Winner") {
    styling =
      "linear-gradient(135deg,rgba(50,115,250,.2),rgba(50,115,250,0)),#191937";
  } else {
    styling =
      "linear-gradient(135deg,rgba(255,78,80,.16),rgba(255,78,80,0)),#191937";
  }
  // const {
  //   health,
  //   mana,
  //   moveSpeed,
  //   attSpeed,
  //   magProt,
  //   physProt,
  //   magPower,
  //   physPower,
  //   HP5,
  //   MP5,
  //   baseAttDamage,
  //   price,
  // } = calcBuildStats(player.godBuild, player.godStats);

  // let td = 0
  // const [totalDamage, setTotalDamage] = useState(0);
  const message: any[] = [];

  return (
    <Accordion>
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        style={{ background: styling, maxHeight: "100px" }}
      >
        <PlayerMatchDisplay player={player} />
      </AccordionSummary>
      <AccordionDetails style={{ background: styling }}>
        <div
          className="player-stats-breakdown"
          style={{ minWidth: "911px", color: "white" }}
        >
          <div className="row">
            <div className="column">
              <DataRow
                props={{
                  Account_Level: player.Account_Level,
                  Ranked_Stat_Conq: player.Ranked_Stat_Conq,
                  Player_Name: player.Player_Name,
                  games: 1,
                  show: false,
                }}
              />
            </div>
            <div>
              <span className="player-info-style">KDA: </span>{" "}
              {player.Kills_Player}
              <span style={{ color: "#5f5f7b" }}> / </span>
              <span style={{ color: "#ff4e50" }}>{player.Deaths}</span>
              <span style={{ color: "#5f5f7b" }}> / </span>
              {player.Assists}
              <span className="helper-text">
                {calcKDA(player.Kills_Player, player.Deaths, player.Assists)}{" "}
                KDA
              </span>
              <br></br>
              <div className="column">
                <DataRow
                  props={{
                    healing: player.Healing,
                    healing_self: player.Healing_Player_Self,
                    games: 1,
                    show: false,
                  }}
                />
              </div>
            </div>
            <div className="column">
              <DataRow
                props={{
                  Kills_Fire_Giant: player.Kills_Fire_Giant,
                  Kills_Gold_Fury: player.Kills_Gold_Fury,
                  objective_assists: player.Objective_Assists,
                  games: 1,
                  show: false,
                }}
              />
            </div>
            <div className="column">
              <DataRow
                props={{
                  Damage_Player: player.Damage_Player,
                  Damage_Taken: player.Damage_Taken,
                  Damage_Mitigated: player.Damage_Mitigated,
                  games: 1,
                  show: false,
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="column">
              <DataRow
                props={{
                  Gold_Earned: player.Gold_Earned,
                  Gold_Per_Minute: player.Gold_Per_Minute,
                  games: 1,
                  show: false,
                }}
              />
            </div>
            <div className="column">
              <DataRow
                props={{
                  tower_damage: player.Structure_Damage,
                  tower_kills: player.Towers_Destroyed,
                  phoenix_kills: player.Kills_Phoenix,
                  games: 1,
                  show: false,
                }}
              />
            </div>
            <div className="column">
              <DataRow
                props={{
                  Final_Match_Level: player.Final_Match_Level,
                  Skin: player.Skin,
                  Wards_Placed: player.Wards_Placed,
                  games: 1,
                  show: false,
                }}
              />
            </div>
            <div className="column">
              <DataRow
                props={{
                  Final_Match_Level: player.Final_Match_Level,
                  Skin: player.Skin,
                  Wards_Placed: player.Wards_Placed,
                  games: 1,
                  show: false,
                }}
              />
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

function PlayerMatchSummary({ players }: { players: IPlayer[] }) {
  return (
    <div className="match-summary-container-players">
      {players.map((player: IPlayer) => {
        return (
          <div className={"player-container ".concat(player.Win_Status)}>
            {CustomizedAccordions(player)}
          </div>
        );
      })}
    </div>
  );
}

export default function Match(props: any) {
  const startMatchId: string = window.location.href.split("/")[5];
  const { isLoading, error, data, isFetching } = useQuery(
    "fetchMatch",
    async () => {
      const res = await fetch("/api/getmatch/".concat(startMatchId));
      return res.json();
    },
    { staleTime: Infinity }
  );

  if (isLoading)
    return (
      <div
        className="container content-container"
        style={{ maxWidth: "fit-content" }}
      >
        <Loading />
      </div>
    );

  if (error)
    return (
      <div
        className="container content-container"
        style={{ maxWidth: "fit-content" }}
      >
        <Error />
      </div>
    );

  const matchData: IMatch = data;
  const [winningTeam, losingTeam] = parseMatchData(matchData);

  console.log(matchData);
  let players: IPlayer[] = [];
  for (const [key, value] of Object.entries(matchData)) {
    if (key.includes("player")) {
      players.push({
        ...value,
        Mode: matchData.Mode,
        Queue_Type: matchData.Queue_Type,
      });
    }
  }
  console.log(players[0]);
  return (
    <div
      className="container content-container"
      style={{ maxWidth: "fit-content" }}
    >
      <div
        className="content-section shrink-padding"
        style={{ marginTop: "36px" }}
      >
        <div className="content-section_header">
          Match Summary&nbsp;
          <span style={{ color: "#5f5f7b", fontSize: "14px" }}>
            Click on players to see their performance
          </span>
        </div>
        <div className="match-container">
          <BaseMatchSummary
            matchId={matchData.MatchId}
            length={matchData.Minutes}
            bansWinner={winningTeam.bans}
            bansLoser={losingTeam.bans}
            mmrWinner={winningTeam.mmr}
            mmrLoser={losingTeam.mmr}
            date={matchData.Entry_Datetime}
            godsWinner={winningTeam.gods}
            godsLoser={losingTeam.gods}
            matchData={matchData}
            queueType={matchData.Queue_Type}
            mode={matchData.Mode}
            carryScoreWinner={winningTeam.carryScore}
            carryPlayerWinner={winningTeam.carryPlayer}
            carryScoreLoser={losingTeam.carryScore}
            carryPlayerLoser={losingTeam.carryPlayer}
          />
          <PlayerMatchSummary players={[...players]} />
        </div>
      </div>
    </div>
  );
}
