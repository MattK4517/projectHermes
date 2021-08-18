import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Component.css";
import styled from 'styled-components';
import useFetch from "./useFetch";


const ImageDiv = styled.div`
  background-Position: 75% -100%;
  background:
    repeat no-repeat, 
    radial-gradient(400px 200px at 75% 20%, rgba(7, 7, 32, 0) 0%, #070720 100%), 
    linear-gradient(to right, #070720 30%, rgba(7, 7, 32, 0.6) 100%), 
    url(${props => props.url ? props.url.replace("icons", "cards") : "https://i.ytimg.com/vi/xAPsmI_zDZs/maxresdefault.jpg"})
`

class GodHeader extends React.Component {
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
              <span>{this.props.god}</span>
              <span>
                Build for {this.props.role}, {this.props.rank}
              </span>
            </h1>
            <div className="god-header-row2">
              <div className="god-abilities">
                <GodAbilities abilities={this.props.abilities} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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

class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.role};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.props.roleState(this.props.role)
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button type="submit" value={this.props.role}>{this.props.role}</button>
      </form>
    )
  }
}


class GodRankStats extends React.Component {
  render() {
    return (
      <div className="content-section god-rank-stats">
        <div className="win-rate">
          <div className="value">{this.props.winrate}%</div>
          <div className="label">Win Rate</div>
        </div>

        <div className="pick-rate">
          <div className="value">{this.props.pickrate}%</div>
          <div className="label">Pick Rate</div>
        </div>

        <div className="ban-rate">
          <div className="value">{this.props.banrate}%</div>
          <div className="label">Ban Rate</div>
        </div>

        <div className="matches">
          <div className="value">{this.props.games}</div>
          <div className="label">Matches</div>
        </div>
      </div>
    );
  }
}

class GodCounterStats extends React.Component {
  render() {
    return (
      <>
        {this.props.matchups.map((matchup, index) => {
          return <GodCounterMatchup getMatchups={matchup} key={index} />;
        })}
      </>
      // <div key={index} className="god-matchups">
      //   <GodCounterMatchup getMatchups={this.props.matchups} />
      // </div>
    );
  }
}

class GodCounterMatchup extends React.Component {
  render() {
    return (
      <Link
        to={"/".concat((this.props.getMatchups.enemy).replaceAll(" ", "_"))}
        className="god-matchup"
      >
        <div className="god-icon">
          <img
            className="god-icon-style"
            src={this.props.getMatchups.url.url}
            alt={this.props.getMatchups.enemy}
          />
        </div>
        <div className="god-name">{this.props.getMatchups.enemy}</div>
        <hr></hr>
        <div className="matchup-stats">
          <div className="win-rate"><strong>{this.props.getMatchups.winRate}%</strong></div>
          <div className="times-played">
            {this.props.getMatchups.timesPlayed} Matches
          </div>
        </div>
      </Link>
    );
  }
}

class BuildStats extends React.Component {
  render() {
    return (
      <>
        {this.props.stats.map((item, index) => {
          if (index >= this.props.lower && index < this.props.upper) {
            return <BuildStatsElement itemStats={item} key={index}/>;
          }
        })}
      </>
    );
  }
}

class BuildStatsElement extends React.Component {
  render() {
    return (
      <>
        <div className="item-row">
          <div className="item-dupe">
            <div className="item-image">
              <div className="item-image-div">
                <img
                  src={this.props.itemStats.url}
                  alt={this.props.itemStats.item}
                />
              </div>
            </div>
            <div className="item-stats">
              <div className="winrate">
                {(
                  (this.props.itemStats.wins / this.props.itemStats.games) *
                  100
                ).toFixed(2)}
                %
              </div>
              <div className="matches">
                {this.props.itemStats.games} Matches
              </div>
            </div>
          </div>
          <div className="item-dupe">
            <div className="item-image">
              <div className="item-image-div">
                <img
                  src={this.props.itemStats.url2}
                  alt={this.props.itemStats.item2}
                />
              </div>
            </div>
            <div className="item-stats">
              <div className="winrate">
                {(
                  (this.props.itemStats.wins2 / this.props.itemStats.games2) *
                  100
                ).toFixed(2)}
                %
              </div>
              <div className="matches">
                {this.props.itemStats.games2} Matches
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } 
}


function Godpage(god){
  const pagegod = god.god.replaceAll("_", " ");
  const role = god.role
  var [url, seturl] = useState(0);
  const [displaygod, setgod] = useState(0);
  const [abilities, setabilities] = useState([]);
  const [roles, setroles] = useState(["Solo", "Jungle", "Mid", "Support", "Carry"]);
  const [ranks, setranks] = useState(["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Masters", "Grandmaster", "All_Ranks"])
  const [dispRole, setrole] = useState(role)
  const [dispRank, setrank] = useState("All_Ranks")
  const {games, banrate, pickrate, winrate, matchups, items} = useFetch(pagegod, dispRole, dispRank)
  useEffect(() => {
    fetch("/".concat(pagegod)).then((res) =>
      res.json().then((data) => {
        setgod(pagegod);
        seturl(data.url);
      })
    );
  }, []);

  useEffect(() => {
    fetch("/".concat(pagegod, "/abilities")).then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setabilities((abilities) => [
            ...abilities,
            {
              name: data[key].name,
              url: data[key].url,
            },
          ]);
        });
      })
    );
  }, []);

  return (
    <>
      <div className="Godpage">
        <div className="container">
          <ImageDiv className="god-container build_page" url={url}> 
            <div className="row align-items-center my-5">
              {/* <div class="col-lg-5"></div> */}
              <h1 className="font-weight-light"></h1>

              <GodHeader
                god={displaygod}
                url={url}
                tier="S"
                role={dispRole}
                rank={dispRank.replaceAll("_", " ")}
                abilities={abilities}
              />
              {roles.map((role) =>{
                return (
                  <FilterForm role={role} god={pagegod} roleState={setrole}/>
                )
              })}
              {ranks.map((rank) =>{
                return (
                  <FilterForm role={rank.replaceAll("_", " ")} god={pagegod} roleState={setrank}/>
                )
              })}
              <div className="god-build">
                <GodRankStats
                  winrate={winrate}
                  games={games}
                  banrate={banrate}
                  pickrate={pickrate}
                  url={url}
                />
                <div className="toughest-matchups content-section">
                  <div className="content-section_header">
                    <span>Counter Matchups these gods counter {displaygod} {dispRole}</span>
                  </div>
                  <div className="matchups">
                    <GodCounterStats matchups={matchups} />
                  </div>
                </div>
                <div className="build content-section">
                  <div className="starter">
                    <div className="content-section_header">Starter</div>
                    <div>
                      <BuildStats stats={items} lower={0} upper={1} />
                    </div>
                  </div>
                  <div className="slot1">
                    <div className="content-section_header">Second Slot Options</div>
                    <div>
                      <BuildStats stats={items} lower={1} upper={2} />
                    </div>
                  </div>
                  <div className="slot2">
                    <div className="content-section_header">
                      Third Slot Options
                    </div>
                    <div>
                      <BuildStats stats={items} lower={2} upper={3} />
                    </div>
                  </div>
                  <div className="slot3">
                    <div className="content-section_header">
                      Fourth Slot Options
                    </div>
                    <div>
                      <BuildStats stats={items} lower={3} upper={4} />
                    </div>
                  </div>
                  <div className="slot4">
                    <div className="content-section_header">
                      Fifth Slot Options
                    </div>
                    <div>
                      <BuildStats stats={items} lower={4} upper={5} />
                    </div>
                  </div>
                  <div className="slot5">
                    <div className="content-section_header">
                      Sixth Slot Options
                    </div>
                    <div>
                      <BuildStats stats={items} lower={5} upper={6} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ImageDiv>
        </div>
      </div>
    </>
  );
}

export default Godpage;