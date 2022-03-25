import React, { useState, useEffect } from "react";
import useFetch from "../useFetch";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import winRateColor from "./WinRateColor";
import { styled } from "@mui/system";
import { FilterForm } from "../Filters/FilterForm";
import { DropDownFilter } from "../Filters/DropDownFilter";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Godpage from "../mainGodPage/Godpage";
import SearchBarGodPage from "../SearchBarStuff/SearchBarGodPage";
import RSSFeeder from "../RssFeed";
import InfiniteScroll from "react-infinite-scroll-component";
import ChangeLog from "../Changelog";
import { ItemTable } from "./Items";
import { CreateItemToolTip } from "./GodPageHelpers";

const godsDict = {
  "All Gods": "None",
  Achilles: "Solo",
  Agni: "Mid",
  "Ah Muzen Cab": "Carry",
  "Ah Puch": "Mid",
  Amaterasu: "Solo",
  Anhur: "Carry",
  Anubis: "Mid",
  "Ao Kuang": "Jungle",
  Aphrodite: "Mid",
  Apollo: "Carry",
  Arachne: "Jungle",
  Ares: "Support",
  Artemis: "Carry",
  Artio: "Support",
  Athena: "Support",
  Awilix: "Jungle",
  "Baba Yaga": "Mid",
  Bacchus: "Supprt",
  Bakasura: "Jungle",
  "Baron Samedi": "Mid",
  Bastet: "Jungle",
  Bellona: "Solo",
  Cabrakan: "Support",
  Camazotz: "Jungle",
  Cerberus: "Support",
  Cernunnos: "Carry",
  Chaac: "Solo",
  "Chang'e": "Mid",
  Charybdis: "Carry",
  Chernobog: "Carry",
  Chiron: "Carry",
  Chronos: "Carry",
  Cthulhu: "Support",
  "Cu Chulainn": "Solo",
  Cupid: "Carry",
  "Da Ji": "Jungle",
  Danzaburou: "Carry",
  Discordia: "Mid",
  "Erlang Shen": "Jungle",
  Eset: "Mid",
  Fafnir: "Support",
  Fenrir: "Jungle",
  Freya: "Carry",
  Ganesha: "Support",
  Geb: "Support",
  Gilgamesh: "Solo",
  "Guan Yu": "Solo",
  Hachiman: "Carry",
  Hades: "Mid",
  "He Bo": "Mid",
  Heimdallr: "Carry",
  Hel: "Mid",
  Hera: "Mid",
  Hercules: "Solo",
  Horus: "Support",
  "Hou Yi": "Carry",
  "Hun Batz": "Jungle",
  Izanami: "Carry",
  Janus: "Mid",
  "Jing Wei": "Carry",
  Jormungandr: "Solo",
  Kali: "Jungle",
  Khepri: "Support",
  "King Arthur": "Solo",
  Kukulkan: "Mid",
  Kumbhakarna: "Support",
  Kuzenbo: "Support",
  Loki: "Jungle",
  Medusa: "Carry",
  Mercury: "Jungle",
  Merlin: "Mid",
  "Morgan Le Fay": "Mid",
  Mulan: "Solo",
  "Ne Zha": "Jungle",
  Neith: "Carry",
  Nemesis: "Jungle",
  Nike: "Solo",
  Nox: "Mid",
  "Nu Wa": "Mid",
  Odin: "Solo",
  Olorun: "Carry",
  Osiris: "Solo",
  Pele: "Jungle",
  Persephone: "Mid",
  Poseidon: "Mid",
  Ra: "Mid",
  Raijin: "Mid",
  Rama: "Carry",
  Ratatoskr: "Jungle",
  Ravana: "Jungle",
  Scylla: "Mid",
  Serqet: "Jungle",
  Set: "Jungle",
  Skadi: "Carry",
  Sobek: "Support",
  Sol: "Carry",
  "Sun Wukong": "Solo",
  Susano: "Jungle",
  Sylvanus: "Support",
  Terra: "Support",
  Thanatos: "Jungle",
  "The Morrigan": "Mid",
  Thor: "Jungle",
  Thoth: "Mid",
  Tiamat: "Mid",
  Tsukuyomi: "Jungle",
  Tyr: "Solo",
  Ullr: "Carry",
  Vamana: "Solo",
  Vulcan: "Mid",
  Xbalanque: "Carry",
  "Xing Tian": "Support",
  Yemoja: "Support",
  Ymir: "Support",
  Zeus: "Mid",
  "Zhong Kui": "Solo",
};
let routes = [];
Object.keys(godsDict).forEach((god) => {
  routes = [
    ...routes,
    {
      path: "/".concat(god).replaceAll(" ", "_"),
      component: <Godpage god={god} role={godsDict[god]} />,
      god: god,
    },
    // {
    //   path: "/".concat(god.replaceAll(" ", "_"), "/items"),
    //   component: <Items god={god} role={godsDict[god]}/>,
    //   "god": god,
    // }
  ];
});

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
        style={{ maxWidth: "75px" }}
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
          <div
            className="win-rate"
            style={{ color: winRateColor(this.props.getMatchups.winRate) }}
          >
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
  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "10px",
    border: "none",
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
  [theme.breakpoints.down("md")]: {
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
          <div className="value" style={{ color: this.props.colorStyle }}>
            {this.props.winrate}%
          </div>
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

function BuildStats(props) {
  return (
    <>
      {props.stats.map((item, index) => {
        if (index >= props.lower && index < props.upper && item.item) {
          return (
            <>
              <BuildStatsElement key={index} item={item} />
            </>
          );
        }
      })}
    </>
  );
}

function BuildStatsElement(props) {
  console.log(props);
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
                  <img src={props.item[slot].url} alt={props.item[slot].item} />
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CustDiv = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    backgroundColor: "#0000FF",
    display: "none",
  },
}));

export default function BuildPage(pagegod) {
  const itemColumns = React.useMemo(
    () => [
      {
        Header: "Items",
        accessor: "item",
      },
      {
        Header: "Games",
        accessor: "games",
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
      },
    ],
    []
  );

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

  const [matchup, setMatchup] = useState("None");
  const { games, badmatchups, goodmatchups, items, colorStyle } = useFetch(
    "Achilles",
    role,
    rank,
    "9.3",
    matchup,
    "Ranked"
  );
  const [slotOneItems, setSlotOneItems] = useState([]);
  const [patch, setPatch] = useState("9.3");
  const [queue_type, setMode] = useState("Ranked");
  useEffect(() => {
    fetch(
      "/api/".concat(
        "Achilles",
        "/items/",
        role,
        "/",
        rank,
        "/",
        patch,
        "/",
        queue_type
      )
    ).then((res) =>
      res.json().then((data) => {
        setSlotOneItems([]);
        Object.keys(data).forEach((slot) => {
          if (slot === "slot1") {
            Object.keys(data[slot]).forEach((item, index) => {
              if (index < 5) {
                setSlotOneItems((items) => [
                  ...items,
                  {
                    item: item,
                    games: data[slot][item]["games"],
                    winRate: (
                      (data[slot][item]["wins"] / data[slot][item]["games"]) *
                      100
                    ).toFixed(2),
                  },
                ]);
              }
            });
          }
        });
      })
    );
  }, [role, rank, patch, queue_type]);

  return (
    <div
      className="container home_page"
      style={{
        // display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <div
        className="center"
        style={{
          display: "flex",
          // width: "100%",
          // margin: "auto",
        }}
      >
        <div
          className="god-build"
          style={{
            // backgroundImage: "url(https://i.imgur.com/Y0y5iPZ.jpg)",
            // backgroundRepeat: "no-repeat",
            paddingRight: "24px",
            maxWidth: "750px",
            // opacity: "85%"
          }}
          height={144}
          // dataLength={1}
        >
          <div
            className="toughest-matchups content-section"
            style={{
              backgroundColor: "#191937D9",
            }}
          >
            <div className="content-section_header">
              Introduction&nbsp;
              <span
                style={{
                  color: "#5f5f7b",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Welcome to SmiteStats!
              </span>
            </div>
            <div
              className="matchups"
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "1rem",
              }}
            >
              <p>
                SmiteStats.gg is a statistics website for SMITE. This page will
                go through all the features provided as well as explain what all
                the numbers mean. SmiteStats prides itself on allowing users to
                get the most granular data available, if someones played it you
                can get data from it.
              </p>
            </div>
          </div>
          <InfiniteScroll
            className="toughest-matchups content-section test_page"
            dataLength={1}
            height={"1000px"}
            style={{
              backgroundColor: "#191937D9",
            }}
          >
            <div className="content-section_header">
              God Pages&nbsp;
              <span
                style={{
                  color: "#5f5f7b",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                This is where most of the god stats are (Scroll For More Info)
              </span>
            </div>
            <div
              className="matchups"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p>
                God Pages are where you'll find individual god stats for any god
                in the game<br></br>
                Including
                <ul className="home-page-section">
                  <div className="content-section_header">
                    Pick, Ban and Win Rates
                  </div>
                  <HomeRankStats
                    winrate={50}
                    pickrate={50}
                    banrate={50}
                    games={games}
                  />
                  <div className="content-section_header">
                    Counter and Favored Matchups
                  </div>
                  <p>
                    Winrate Shown is INTO God Shown<br></br># Matches is the
                    Amount of Times the Matchup has Been Played<br></br>
                    Each Matchup is Clickable and Links to the God Shown Own
                    Stats
                  </p>
                  <div className="matchups">
                    <GodCounterStats matchups={badmatchups} />
                  </div>
                  <div className="content-section_header">
                    A Popularity Based 6 Item Build
                  </div>
                  <p>
                    Winrate of the God When Item is Built<br></br># Matches is
                    the Amount of Times the Matchup has Been Played<br></br>
                    Each Item has a Tooltip Showing Ingame Stats for the Item
                  </p>
                  <div className="starter">
                    <div>
                      <BuildStats stats={items} lower={0} upper={1} />
                    </div>
                  </div>
                  <div className="content-section_header">
                    Rank and Role Data Filters
                  </div>
                  <p>
                    Sort by ANY God, Rank, Role, Patch Combination<br></br>
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
                        <div className="hide">
                          <DropDownFilter
                            changePatch={null}
                            patch={"9.3"}
                            style={{ color: "white" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ul>
              </p>
            </div>
          </InfiniteScroll>
        </div>
        <CustDiv>
          <ChangeLog />
          <RSSFeeder />
        </CustDiv>
      </div>
    </div>
  );
}
