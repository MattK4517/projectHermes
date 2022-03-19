import React from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import winRateColor from "./WinRateColor";
import { styled } from "@mui/system";
import { HtmlTooltip, CreateItemToolTip } from "./GodPageHelpers";

function CreateMatchupsHelpTooltip(props) {
  return (
    <div style={{ color: "white", fontSize: ".75rem" }}>
      <h3>What do these numbers mean?</h3>
      <div>
        <p>the percentage shown is {props.god} win rate INTO the god shown</p>
        <p>
          meaning the lower the number the worse the matchup is for {props.god}
        </p>
      </div>
    </div>
  );
}

function GodCounterMatchup(props) {
  return (
    <Link
      to={"/".concat(props.getMatchups.enemy.replaceAll(" ", "_"))}
      className="god-matchup"
    >
      <div className="god-icon">
        <img
          className="god-icon-style"
          src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.getMatchups.enemy
          .replaceAll("'", "")
          .replaceAll(" ", "-")
          .toLowerCase()}.jpg`}
          alt={props.getMatchups.enemy}
        />
      </div>
      <div className="god-name">{props.getMatchups.enemy}</div>
      <hr></hr>
      <div className="matchup-stats">
        <div
          className="win-rate"
          style={{
            color: winRateColor(props.getMatchups.winRate),
            fontWeight: "725px",
          }}
        >
          {props.getMatchups.winRate}%
        </div>
        <div className="times-played">
          {props.getMatchups.timesPlayed} Matches
        </div>
      </div>
    </Link>
  );
}

function GodCounterStats(props) {
  if (props.matchups.length > 0) {
    return (
      <>
        {props.matchups.map((matchup, index) => {
          return <GodCounterMatchup getMatchups={matchup} key={index} />;
        })}
      </>
    );
  } else {
    return <div className="empty-set">NO DATA TO DISPLAY</div>;
  }
}

const ResponsiveBuild = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));

function GodRankStats(props) {
  let banrateMessage;
  if (props.mode === "Ranked") {
    banrateMessage = props.banrate + "%";
  } else if (props.mode === "Casual") {
    banrateMessage = "N/A";
  }
  return (
    <div className="content-section god-rank-stats">
      <div className="win-rate">
        <div className="value" style={{ color: props.colorStyle }}>
          {props.winrate}%
        </div>
        <div className="label">Win Rate</div>
      </div>

      <div className="pick-rate">
        <div className="value">{props.pickrate}%</div>
        <div className="label">Pick Rate</div>
      </div>

      <div className="ban-rate">
        <div className="value">{banrateMessage}</div>
        <div className="label">Ban Rate</div>
      </div>

      <div className="matches">
        <div className="value">{props.games}</div>
        <div className="label">Matches</div>
      </div>
    </div>
  );
}

function BuildStats(props) {
  return (
    <>
      {props.stats.map((item, index) => {
        if (index >= props.lower && index < props.upper && item.item) {
          return (
            <>
              <BuildStatsElement itemStats={item} key={index} item={item} />
            </>
          );
        }
      })}
    </>
  );
}

function BuildStatsElement(props) {
  return (
    <div className="item-row">
      {Object.keys(props.item).map((slot) => {
        return (
          <div className="item-dupe">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <CreateItemToolTip item={props.item[slot]} />
                </React.Fragment>
              }
              placement="top"
              arrow
            >
              <div className="item-image">
                <div className="item-image-div">
                  <img
                    src={`https://webcdn.hirezstudios.com/smite/item-icons/${props.item[
                      slot
                    ].item
                      .replaceAll(" ", "-")
                      .replaceAll("'", "")
                      .toLowerCase()}.jpg`}
                    alt={props.item[slot].item}
                  />
                </div>
              </div>
            </HtmlTooltip>
            <div className="item-stats">
              <div className="winrate">
                {(
                  (props.item[slot].wins / props.item[slot].games) *
                  100
                ).toFixed(2)}
                % WR
              </div>
              <div className="matches">{props.item[slot].games} Matches</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BuildPage(props) {
  let { games, badmatchups, goodmatchups, items, colorStyle, relics } =
    useFetch(
      props.pagegod,
      props.role,
      props.rank,
      props.patch,
      props.matchup,
      props.mode
    );
  if (items.length === 0) {
    items = ["None"];
  }
  let styling = {};
  let goodStyling = {};
  if (badmatchups.length < 1) {
    styling = { display: "flex", flexDirection: "column", color: "#bbbedb" };
  } else {
    styling = {};
  }
  if (goodmatchups.length < 1) {
    goodStyling = {
      display: "flex",
      flexDirection: "column",
      color: "#bbbedb",
    };
  } else {
    styling = {};
  }
  return (
    <div className="god-build">
      <GodRankStats
        winrate={props.winrate}
        games={games}
        banrate={props.banrate}
        pickrate={props.pickrate}
        // url={url}
        colorStyle={colorStyle}
        mode={props.mode}
      />
      <div className="toughest-matchups content-section">
        <div className="content-section_header">
          Counter Matchups&nbsp;
          <span
            style={{ color: "#5f5f7b", fontSize: "14px", fontWeight: "400" }}
          >
            these gods counter {props.pagegod} {props.role}
          </span>
          <HtmlTooltip
            title={
              <React.Fragment>
                <CreateMatchupsHelpTooltip god={props.pagegod} />
              </React.Fragment>
            }
            placement="top"
            arrow
          >
            <div style={{ paddingLeft: "25px" }}>
              <div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/300px-Icon-round-Question_mark.svg.png"
                  style={{ maxWidth: "24px", maxHeight: "24px" }}
                />
              </div>
            </div>
          </HtmlTooltip>
        </div>
        <div className="matchups" style={styling}>
          <GodCounterStats matchups={badmatchups} />
        </div>
      </div>
      <div className="combined-section">
        <div className="toughest-matchups content-section">
          <div className="content-section_header">
            Good Matchups&nbsp;
            <span
              style={{ color: "#5f5f7b", fontSize: "14px", fontWeight: "400" }}
            >
              these gods get countered by {props.pagegod} {props.role}
            </span>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <CreateMatchupsHelpTooltip god={props.pagegod} />
                </React.Fragment>
              }
              placement="top"
              arrow
            >
              <div style={{ paddingLeft: "25px" }}>
                <div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/300px-Icon-round-Question_mark.svg.png"
                    style={{ maxWidth: "24px", maxHeight: "24px" }}
                  />
                </div>
              </div>
            </HtmlTooltip>
          </div>
          <div className="matchups" style={goodStyling}>
            <GodCounterStats matchups={goodmatchups} />
          </div>
        </div>
        <ResponsiveBuild
          className="build content-section relics"
          style={styling}
        >
          {relics.map((item, index) => {
            if (item === "None") {
              return (
                <>
                  <div className="content-section_header">Relics</div>
                  <div className="empty-set">NO DATA TO DISPLAY</div>
                </>
              );
            }
            if (index === 0) {
              return (
                <div className="starter">
                  <div className="content-section_header">
                    Relics&nbsp;
                    <span
                      style={{
                        color: "#5f5f7b",
                        fontSize: "14px",
                        fontWeight: "400",
                      }}
                    >
                      for {props.pagegod} {props.role}
                    </span>
                  </div>
                  <div>
                    <BuildStats stats={relics} lower={0} upper={1} />
                  </div>
                </div>
              );
            }
          })}
        </ResponsiveBuild>
      </div>
      <ResponsiveBuild
        className="build content-section scrolling-section"
        style={styling}
      >
        {items.map((item, index) => {
          let message = "";
          if (index === 1) {
            message = "Second";
          }
          if (index === 2) {
            message = "Third";
          }
          if (index === 3) {
            message = "Fourth";
          }
          if (index === 4) {
            message = "Fifth";
          }
          if (index === 5) {
            message = "Sixth";
          }
          if (item === "None") {
            return (
              <>
                <div className="content-section_header">Build</div>
                <div className="empty-set">NO DATA TO DISPLAY</div>
              </>
            );
          }
          if (index === 0) {
            return (
              <div className="starter">
                <div className="content-section_header">Starter</div>
                <div>
                  <BuildStats stats={items} lower={0} upper={1} />
                </div>
              </div>
            );
          } else {
            return (
              <div className={`slot${index}`}>
                <div className="content-section_header">
                  {message} Slot Options
                </div>
                <div>
                  <BuildStats stats={items} lower={index} upper={index + 1} />
                </div>
              </div>
            );
          }
        })}
      </ResponsiveBuild>
    </div>
  );
}
