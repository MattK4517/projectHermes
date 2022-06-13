
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Home from "./Home";
import GodsScreen from "./Gods";
import Godpage from "./mainGodPage/Godpage";
import TierListPage from "./TierListPage";
import ContactForm from "./ContactForm";
import Match from "./MatchPage/Match";
// import { Godpage, GodsScreen, TierListPage, Match, Home, ContactForm } from "./"
import SearchBar from "./SearchBarStuff/SearchBar";
import Player from "./PlayerPage/Player";
import OverviewDisplay from "./PlayerPage/OverviewDisplay";
import GodStatsDisplay from "./PlayerPage/GodStatsDisplay";
import { PlayerProvider } from "./PlayerPage/PlayerContext";
import DamageCalculator from "./DmgCalcPage/DamageCalculator"
import { DamageProvider } from './DmgCalcPage/DamageContext';
import { TierListProvider } from './Tierlists/TierListContext';
import FindAMatch from './MatchPage/FindAMatch';
import { MainProvider } from './mainGodPage/MainContext';
import SkinStatPage from './mainGodPage/Skins/SkinStatPage';
import Button from '@mui/material/Button';

export const compare = (a, b) => {
  return a.winRate - b.winRate;
};

export const godsDict = {
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
  Atlas: "Support",
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
  Cliodhna: "Jungle",
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
  Lancelot: "Jungle",
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
  Shiva: "Solo",
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
  "Yemoja": "Support",
  "Ymir": "Support",
  "Yu Huang": "Mid",
  "Zeus": "Mid",
  "Zhong Kui": "Solo"
};
let routes = [
  {
    path: "/",
    component: <Home />,
    god: "",
  },
  {
    path: "/Gods",
    component: <GodsScreen />,
    god: "",
  },
  {
    path: "/tierlist",
    component: <TierListPage />,
    god: "",
  },
  {
    path: "/contact",
    component: <ContactForm />,
    god: "",
  },
  {
    path: ["/match/:handle", "/match"],
    component: <Match />,
    god: "",
  },
  {
    path: ["/player/:handle", "/player"],
    component: <Player />,
    god: "",
  },
  {
    path: ["/player/:handle/god-stats"],
    component: <GodStatsDisplay />,
    god: "",
  },
  {
    path: ["/player/:handle/god-stats/:handle"],
    component: <OverviewDisplay />,
    god: "",
  },
  {
    path: ["/damage_calculator"],
    component: <DamageCalculator />,
    god: "",
  },
  {
    path: ["/find_a_match"],
    component: <FindAMatch />,
    god: "",
  },
];
Object.keys(godsDict).forEach((god) => {
  routes = [
    ...routes,
    {
      path: "/".concat(god).replaceAll(" ", "_"),
      component: <Godpage god={god} role={godsDict[god]} />,
      god: god,
    },
    {
      path: "/".concat(god, "/skin-stats/:handle").replaceAll(" ", "_"),
      component: <SkinStatPage god={god} />,
      god: god,
    },
  ];
});

const CustDrawer = styled(Drawer)(({ theme }) => ({
  width: "225px",
  height: "100vh",
  backgroundColor: "#17172e",
  "& .MuiDrawer-paper": {
    width: "inherit",
    borderRight: "none",
    height: "100%",
    backgroundColor: "#17172e",
  },
  [theme.breakpoints.down("lg")]: {
    width: "135px",
    "& .MuiDrawer-paper": {
      width: "inherit",
      borderRight: "none",
      height: "100%",
    },
  },
  [theme.breakpoints.down("sm")]: {
    display: "none"
  },

}));


const Root = styled(AppBar)(({ theme }) => ({
  padding: theme.spacing(1),
  left: "225px",
  backgroundColor: "#17172e",
  width: "auto",

  [theme.breakpoints.down("sm")]: {
    left: "0 !important",
  },
  [theme.breakpoints.down("lg")]: {
    display: "flex",
    alignItems: "center",
    left: "135px",
  },
}));

const Hamburger = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },

}));




export default function PermanentDrawerLeft() {
  const routeComponents = routes.map(({ path, component }, key) => (
    <Route exact path={path} component={() => component} key={key} />
  ));
  return (
    <Box sx={{ display: "flex" }}>
      <CustDrawer
        variant="permanent"
        anchor="left"
      >
        <Divider
          sx={{
            color: "#bbbedb",
            bgColor: "#17172e",
          }}
        />
        <List
          className="main-nav-wrapper"
          sx={{
            paddingLeft: "10px",
            color: "#bbbedb",
            bgcolor: "#17172e",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {["Home", "Gods", "Tierlist", "Contact", "Find A Match"].map(
            (text, index) => {
              let route = text;
              let icon;
              if (text === "Home") {
                route = "";
                icon = <AiIcons.AiFillHome className="link-icon-svg" />;
              } else if (text === "Gods") {
                icon = <GiIcons.GiPikeman className="link-icon-svg" />;
              } else if (text === "Tierlist") {
                icon = <AiIcons.AiOutlineBars className="link-icon-svg" />;
              } else if (text === "Contact") {
                icon = <AiIcons.AiFillMail className="link-icon-svg" />;
              } else if (text === "Find A Match") {
                icon = <GiIcons.GiSwordClash className="link-icon-svg" />;
              } else if (text === "Damage Calculator") {
                icon = <GiIcons.GiSwordman className="link-icon-svg" />;
              } else {
                route = text;
              }
              return (
                <>
                  <Link
                    key={index}
                    to={"/".concat(route.replaceAll(" ", "_"))}
                    className="main-nav-link"
                    style={{ marginBottom: "20px", marginLeft: "5px" }}
                  >
                    {icon}
                    <p>{text}</p>
                  </Link>
                </>
              );
            }
          )}
        </List>
        <Divider />
        <div className="legal">
          Smitestats.gg isn't endorsed by Hi-Rez Studios and doesn't reflect the
          views or opinions of Hi-Rez Studios or anyone officially involved in
          producing or managing Smite. Smite and Hi-Rez Studios are trademarks
          or registered trademarks of Hi-Rez Studios, Inc. Data provided by
          Hi-Rez Studios. © Hi-Rez Studios, Inc. All rights reserved.
        </div>
      </CustDrawer>

      <Root>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: "flex",
            width: "100%",
          }}
        >


          <Link to={"/"}>
            <img
              src="https://i.imgur.com/1OGq7Nk.png"
              alt="SmiteStats Icon"
              className="logo-icon"
            />
          </Link>

          <Hamburger>
            <div className="nav-row">
              <Link
                to={"/"}
                style={{ paddingRight: "10px" }}
              >
                <img
                  src="https://i.imgur.com/3KNEQMP.png"
                  alt="SmiteStats Icon"
                  className="logo-icon-small"
                />
                Home
              </Link>
              <Link to={"/gods"} style={{ paddingRight: "10px" }}>
                Gods
              </Link>
              <Link to={"/tierlist"}>Tierlist</Link>
            </div>
            <div className="nav-row">
              <Button
                target="_blank"
                href="https://www.patreon.com/smitestats"
                variant="contained">Support SmiteStats</Button>
            </div>
          </Hamburger>

          <div className="hide search-bar_container">
            <SearchBar data={Object.keys(godsDict)} />
            <div style={{ flex: "1", display: "flex", justifyContent: "flex-end", marginRight: "25px" }}>
              <Button
                target="_blank"
                href="https://www.patreon.com/smitestats"
                variant="contained">Support SmiteStats</Button>
            </div>
          </div>
        </Typography>
      </Root >


      <Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
        <Toolbar />
        <MainProvider>
          <PlayerProvider>
            <DamageProvider>
              <TierListProvider>
                <Typography>
                  <Switch>{routeComponents}</Switch>
                </Typography>
              </TierListProvider>
            </DamageProvider>
          </PlayerProvider>
        </MainProvider>
      </Box>
    </Box >
  );
}
