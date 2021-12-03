import React, { useState } from "react";
import useFetch from "../useFetch";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import winRateColor from "./WinRateColor";
import { styled } from "@mui/system";
import { FilterForm } from "../Filters/FilterForm";
import { DropDownFilter } from "../Filters/DropDownFilter";
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Godpage from "../mainGodPage/Godpage";
import SearchBarGodPage from "../SearchBarStuff/SearchBarGodPage";
import RSSFeeder from "../RssFeed";
import InfiniteScroll from "react-infinite-scroll-component"

const godsDict = {
  "All Gods": "None",
  "Achilles": "Solo",
  "Agni": "Mid",
  "Ah Muzen Cab": "Carry",
  "Ah Puch": "Mid",
  "Amaterasu": "Solo",
  "Anhur": "Carry",
  "Anubis": "Mid",
  "Ao Kuang": "Jungle",
  "Aphrodite": "Mid",
  "Apollo": "Carry",
  "Arachne": "Jungle",
  "Ares": "Support",
  "Artemis": "Carry",
  "Artio": "Support",
  "Athena": "Support",
  "Awilix": "Jungle",
  "Baba Yaga": "Mid",
  "Bacchus": "Supprt",
  "Bakasura": "Jungle",
  "Baron Samedi": "Mid",
  "Bastet": "Jungle",
  "Bellona": "Solo",
  "Cabrakan": "Support",
  "Camazotz": "Jungle",
  "Cerberus": "Support",
  "Cernunnos": "Carry",
  "Chaac": "Solo",
  "Chang\'e": "Mid",
  "Charybdis": "Carry",
  "Chernobog": "Carry",
  "Chiron": "Carry",
  "Chronos": "Carry",
  "Cthulhu": "Support",
  "Cu Chulainn": "Solo",
  "Cupid": "Carry",
  "Da Ji": "Jungle",
  "Danzaburou": "Carry",
  "Discordia": "Mid",
  "Erlang Shen": "Jungle",
  "Eset": "Mid",
  "Fafnir": "Support",
  "Fenrir": "Jungle",
  "Freya": "Carry",
  "Ganesha": "Support",
  "Geb": "Support",
  "Gilgamesh": "Solo",
  "Guan Yu": "Solo",
  "Hachiman": "Carry",
  "Hades": "Mid",
  "He Bo": "Mid",
  "Heimdallr": "Carry",
  "Hel": "Mid",
  "Hera": "Mid",
  "Hercules": "Solo",
  "Horus": "Support",
  "Hou Yi": "Carry",
  "Hun Batz": "Jungle",
  "Izanami": "Carry",
  "Janus": "Mid",
  "Jing Wei": "Carry",
  "Jormungandr": "Solo",
  "Kali": "Jungle",
  "Khepri": "Support",
  "King Arthur": "Solo",
  "Kukulkan": "Mid",
  "Kumbhakarna": "Support",
  "Kuzenbo": "Support",
  "Loki": "Jungle",
  "Medusa": "Carry",
  "Mercury": "Jungle",
  "Merlin": "Mid",
  "Morgan Le Fay": "Mid",
  "Mulan": "Solo",
  "Ne Zha": "Jungle",
  "Neith": "Carry",
  "Nemesis": "Jungle",
  "Nike": "Solo",
  "Nox": "Mid",
  "Nu Wa": "Mid",
  "Odin": "Solo",
  "Olorun": "Carry",
  "Osiris": "Solo",
  "Pele": "Jungle",
  "Persephone": "Mid",
  "Poseidon": "Mid",
  "Ra": "Mid",
  "Raijin": "Mid",
  "Rama": "Carry",
  "Ratatoskr": "Jungle",
  "Ravana": "Jungle",
  "Scylla": "Mid",
  "Serqet": "Jungle",
  "Set": "Jungle",
  "Skadi": "Carry",
  "Sobek": "Support",
  "Sol": "Carry",
  "Sun Wukong": "Solo",
  "Susano": "Jungle",
  "Sylvanus": "Support",
  "Terra": "Support",
  "Thanatos": "Jungle",
  "The Morrigan": "Mid",
  "Thor": "Jungle",
  "Thoth": "Mid",
  "Tiamat": "Mid",
  "Tsukuyomi": "Jungle",
  "Tyr": "Solo",
  "Ullr": "Carry",
  "Vamana": "Solo",
  "Vulcan": "Mid",
  "Xbalanque": "Carry",
  "Xing Tian": "Support",
  "Yemoja": "Support",
  "Ymir": "Support",
  "Zeus": "Mid",
  "Zhong Kui": "Solo"
}
let routes = [
]
Object.keys(godsDict).forEach((god) => {
  routes = [...routes, {
    path: "/".concat(god).replaceAll(" ", "_"),
    component: <Godpage god={god} role={godsDict[god]}/>,
    "god": god,
  },
  // {
  //   path: "/".concat(god.replaceAll(" ", "_"), "/items"),
  //   component: <Items god={god} role={godsDict[god]}/>,
  //   "god": god,
  // }
]
})


const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#06061f",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    border: ".5px solid gray",
    opacity: 100,
  },
}))(Tooltip);

  class GodCounterStats extends React.Component {
    render() {
        return (
        <>
            {this.props.matchups.map((matchup, index) => {
            return <GodCounterMatchup getMatchups={matchup} key={index} />;
            })}
        </>
        );
    }
  }

  class GodCounterMatchup extends React.Component {
    render() {
      return (
        <Link
          to={"/".concat(this.props.getMatchups.enemy.replaceAll(" ", "_"))}
          className="god-matchup"
          style={{maxWidth: "75px"}}
        >
          <div className="god-icon">
            <img
              className="god-icon-style"
              src={this.props.getMatchups.url}
              alt={this.props.getMatchups.enemy}
            />
          </div>
          <div className="god-name">{this.props.getMatchups.enemy}</div>
          <hr></hr>
          <div className="matchup-stats">
            <div className="win-rate" style={{color: winRateColor(this.props.getMatchups.winRate)}}>
              <strong>{this.props.getMatchups.winRate}%</strong>
            </div>
            <div className="times-played">
              {this.props.getMatchups.timesPlayed} Matches
            </div>
          </div>
        </Link>
      );
    }
  }

const CustHeader = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: "100%",
    padding: "10px",
    border: "none"
  },
  // [theme.breakpoints.up('sm')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.up('lg')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.down('lg')]: {
  //   width: "75%",
  //   fontsize: "8px"
  //   // backgroundColor: "#FFF"
  // },
}));


const ResponsiveBuild = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: "block",
  },
  // [theme.breakpoints.up('sm')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.up('lg')]: {
  //   backgroundColor: "#191937",
  // },
  // [theme.breakpoints.down('lg')]: {
  //   width: "75%",
  //   fontsize: "8px"
  //   // backgroundColor: "#FFF"
  // },
}));



class HomeRankStats extends React.Component {
  render() {
    return (
      <div className="content-section god-rank-stats">
        <div className="win-rate">
          <div className="value" style={{color: this.props.colorStyle}}>{this.props.winrate}%</div>
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

  class BuildStats extends React.Component {
    render() {
      return (
        <>
          {this.props.stats.map((item, index) => {
            if (
              index >= this.props.lower &&
              index < this.props.upper &&
              item.item
            ) {
              return (
                <>
                <BuildStatsElement
                  itemStats={item}
                  key={index}
                  item={item}
                />
                </>
              );
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
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <CreateItemToolTip
                      item={this.props.item.item}
                    />
                  </React.Fragment>
                }
                placement="top"
                arrow
              >
                <div className="item-image">
                  <div className="item-image-div">
                    <img
                      src={this.props.item.item.url}
                      alt={this.props.item.item.item}
                    />
                  </div>
                </div>
              </HtmlTooltip>
              <div className="item-stats">
                <div className="winrate">
                  {(
                    (this.props.item.item.wins / this.props.item.item.games) *
                    100
                  ).toFixed(2)}
                  % WR
                </div>
                <div className="matches">
                  {this.props.item.item.games} Matches
                </div>
              </div>
            </div>
  
  
            <div className="item-dupe">
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <CreateItemToolTip
                      item={this.props.item.item2}
                    />
                  </React.Fragment>
                }
                placement="top"
                arrow
              >
                <div className="item-image">
                  <div className="item-image-div">
                    <img
                      src={this.props.item.item2.url}
                      alt={this.props.item.item2.item}
                    />
                  </div>
                </div>
              </HtmlTooltip>
              <div className="item-stats">
                <div className="winrate">
                  {(
                    (this.props.item.item2.wins / this.props.item.item2.games) *
                    100
                  ).toFixed(2)}
                  % WR
                </div>
                <div className="matches">
                  {this.props.item.item2.games} Matches
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  class CreateItemToolTip extends React.Component {
    render() {
      if (this.props.index == 0) {
        this.props.item = this.props.item.item
      } else if (this.props.index == 1) {
        this.props.item = this.props.item.item2
      }
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
            {this.props.item.item}
          </h5>
          <div>
            <p>{this.props.item.itemShortDesc}</p>
          </div>
          <div className="item-stats">
            <ul>
              {this.props.item.itemStats.map(
                (stat) => {
                  return (
                    <li style={{left: "0"}}>
                      {stat[0]}: {stat[1]}
                    </li>
                  );
                }
              )}
            </ul>
            <div className="item-passive">
              <p>{this.props.item.itemPassive}</p>
            </div>
          </div>
          <p style={{ color: "#D4AF37" }}>
            <b>Price:</b>{" "}
            {this.props.item.itemAbsolutePrice}(
            {this.props.item.itemRelativePrice})
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


export default function BuildPage(pagegod) {
    const [role, setRole] = useState("Solo");
    const [rank, setRank] = useState("All Ranks");
    const [ranks, setranks] = useState([
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Masters",
      "Grandmaster",
      "All Ranks",
    ]);
    const [roles, setroles] = useState([
      "Solo",
      "Jungle",
      "Mid",
      "Support",
      "Carry",
    ]);
    const [matchup, setMatchup] = useState("None")
    const { games, badmatchups, goodmatchups, items, colorStyle } = useFetch(
        "Achilles",
        role,
        rank,
        "8.11",
        matchup
        );
        return (
          <div className="home-image"
          style={{
            display: "flex", 
            flexDirection: "row",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            <div className="god-build"
            style={{ 
              // backgroundImage: "url(https://i.imgur.com/Y0y5iPZ.jpg)",
              // backgroundRepeat: "no-repeat",
              paddingRight: "24px",
              maxWidth: "750px",
              // opacity: "85%"
          }}
          // height={window.innerHeight}
          // dataLength={1}
            >
            <div className="toughest-matchups content-section"
            style={{
              backgroundColor: "#191937D9"
            }}>
              <div className="content-section_header">
                  Introduction&nbsp;
                  <span style={{color: "#5f5f7b", fontSize: "14px", fontWeight: "400"}}>Welcome to SmiteStats!</span>
              </div>
              <div className="matchups" style={{display: "flex", flexDirection: "column", fontSize: "1rem"}}>
                <p>
                  SmiteStats.gg is a statistics website for SMITE. This page will go through all the features provided as well
                  as explain what all the numbers mean. SmiteStats prides itself on allowing users to get the most granular data
                  available, if someones played it you can get data from it.
                </p>
              </div>
            </div>
            <InfiniteScroll
              className="toughest-matchups content-section test_page"
              dataLength={1}
              height={window.innerHeight - 300}
              style={{
                backgroundColor: "#191937D9"
              }}
            >
              <div className="content-section_header">
                  God Pages&nbsp;
                  <span style={{color: "#5f5f7b", fontSize: "14px", fontWeight: "400"}}>
                    This is where most of the god stats are (Scroll For More Info)
                  </span>
              </div>
              <div className="matchups" style={{display: "flex", flexDirection: "column"}}>
                <p>
                  God Pages are where you'll find individual god stats for any god in the game<br></br>
                  Including
                  <ul>
                    <li>Pick, Ban and Win Rates</li>
                    <HomeRankStats
                    winrate={50}
                    pickrate={50}
                    banrate={50}
                    games={games}
                    />
                    <li>Counter and Favored Matchups</li>
                    <p>
                    Winrate Shown is INTO God Shown<br></br>
                    # Matches is the Amount of Times the Matchup has Been Played<br></br>
                    Each Matchup is Clickable and Links to the God Shown Own Stats
                    </p>
                    <div className="matchups">
                      <GodCounterStats matchups={badmatchups} />
                    </div>
                    <li>A Popularity Based 6 Item Build</li>
                    <p>
                      Winrate of the God When Item is Built<br></br>
                      # Matches is the Amount of Times the Matchup has Been Played<br></br>
                      Each Item has a Tooltip Showing Ingame Stats for the Item
                    </p>
                    <div className="starter">
                      <div>
                        <BuildStats
                          stats={items}
                          lower={0}
                          upper={1}
                        />
                      </div>
                    </div>
                    <li>Rank and Role Data Filters</li>
                    <p>Sort by ANY God, Rank, Role, Patch Combination<br></br>
                    Khepri Bronze Jungle Data Here You Come!<br></br>
                    P.S. These Filters are Interactive
                    </p>
                    <div className="filter-manager">
                      <div className="filter-width-wrapper">
                        <div className="filter-manager_container">
                          <FilterForm
                            filter={role}
                            god={"Achilles"}
                            filters={roles}
                            setFilter={setRole}
                          />
                              <FilterForm
                                filter={rank}
                                god={"Achilles"}
                                filters={ranks}
                                setFilter={setRank}
                              />
                          <DropDownFilter changePatch={null} patch={"8.11"} style={{color: "white"}}/>
                        </div>
                      </div>
                    </div>
                    <li>Tables of Every Item Built on the God</li>
                    <p>This is too Large to Display Here but on the God Pages its under the "Items" Tab<br></br></p>
                    <li>A Table First 3 Item Build Paths</li>
                    <p>This is too Large to Display Here but on the God Pages its under the "Build Paths" Tab<br></br></p>
                    <li>A Table Breaking Down Each Matchup in Terms of Preformance Differential</li>
                    <p>This is too Large to Display Here but on the God Pages its under the "Matchups" Tab<br></br></p>
                    <Tabs value={null} aria-label="basic tabs example">
                      <Tab sx={{ color: "white" }} label="Build" {...a11yProps(0)} />
                      <Tab sx={{ color: "white" }} label="Items" {...a11yProps(1)} />
                      <Tab sx={{ color: "white" }} label="Build Paths" {...a11yProps(2)} />
                      <Tab sx={{ color: "white" }} label="Matchups" {...a11yProps(3)} />
                    </Tabs>
                    <li>Ability to Sort by a Specific Enemy Matchup</li>
                    <p>Best to Sort by Enemy Seen Above<br></br></p>
                    <SearchBarGodPage data={routes} changeMatchup={setMatchup}/>
                  </ul>
                </p>
              </div>
            </InfiniteScroll>
          </div>
          <RSSFeeder />
          </div>
        )
    }