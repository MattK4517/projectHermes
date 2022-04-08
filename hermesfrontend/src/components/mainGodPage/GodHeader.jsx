import React from "react";
import { styled } from "@mui/material/styles";
import { tierColor } from "./WinRateColor";

const CustHeader = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

function GodAbilities(props) {
  return (
    <>
      {props.abilities.map((ability, index) => {
        let text;
        if (index === 4) {
          text = "P";
        } else {
          if (index >= 4) {
            text = index;
          } else {
            text = index + 1;
          }
        }
        return (
          <>
            <div className="god-ability-wlabel" key={index}>
              <img src={ability.url} alt={ability.name} />
              <div className="ability-label bottom-center">{text}</div>
            </div>
          </>
        );
      })}
    </>
  );
}

const getMessage = (role, rank, mode, queueType) => {
  let message = `${role}, ${rank}`;

  if (mode != "Conquest" && queueType != "Ranked") {
    message = `${mode}`;
  } else if (mode != "Conquest" && queueType === "Ranked") {
    message = `${mode}, ${rank}`;
  }
  return message;
};

export default function GodHeader(props) {
  return (
    <div className="god-page-header">
      <div className="god-header-wrap">
        <div
          className="god-image-container"
          style={{ borderColor: tierColor(props.tier) }}
        >
          <div
            className="tier-heading"
            style={{ borderColor: tierColor(props.tier) }}
          >
            {props.tier}
          </div>
          <div className="god-page-image-border">
            <div className="notch-border"></div>
            <img className="god-image" src={props.url} alt={props.god} />
          </div>
        </div>
        <div className="god-header-info">
          <h3 className="god-label">
            <span>
              <b style={{ color: "white" }}>{props.god}</b>
            </span>
            <span>
              &nbsp;{props.tab} for{" "}
              {getMessage(props.role, props.rank, props.mode, props.queueType)}
            </span>
          </h3>
          <div className="god-header-row2">
            <div className="god-abilities">
              <GodAbilities abilities={props.abilities} />
            </div>
            <CustHeader className="stat-explanation">
              The best win rate {props.god} build. The best and worst matchups
              for {props.god} and anything else you need, {props.rank} Smite
              Patch {props.patch}
            </CustHeader>
          </div>
        </div>
      </div>
    </div>
  );
}

export { GodHeader, GodAbilities };
