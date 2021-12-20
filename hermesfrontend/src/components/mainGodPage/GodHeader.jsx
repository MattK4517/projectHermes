import React from "react";
import { styled } from '@mui/material/styles';

const CustHeader = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display:  "none",
  },
}));

class GodAbilities extends React.Component {
    render() {
      return (
        <>
          {this.props.abilities.map((ability, index) => {
            return (
              <>
                <div className="god-ability-wlabel" key={index}>
                  <img src={ability.url} alt={ability.name} />
                  <div className="ability-label bottom-center">{index}</div>
                </div>
              </>
            );
          })}
        </>
      );
    }
  }

export default class GodHeader extends React.Component {
    render() {
      return (
        <div className="god-page-header">
          <div className="god-header-wrap">
            <div className="god-image-container">
              <div className="tier-heading">{this.props.tier}</div>
              <div className="god-page-image-border">
                <div className="notch-border"></div>
                <img
                  className="god-image"
                  src={this.props.url}
                  alt={this.props.god}
                />
              </div>
            </div>
            <div className="god-header-info">
              <h1 className="god-label">
                <span><b style={{color: "white"}}>{this.props.god}</b></span>
                <span>
                &nbsp;{this.props.tab} for {this.props.role}, {this.props.rank}
                </span>
              </h1>
              <div className="god-header-row2">
                <div className="god-abilities">
                  <GodAbilities abilities={this.props.abilities} />
                </div>
                <CustHeader className="stat-explanation">
                  The best win rate {this.props.god} build. The best and worst matchups for {this.props.god} and anything else you need, {this.props.rank} Smite Patch {this.props.patch}
                </CustHeader>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  export { GodHeader, GodAbilities }