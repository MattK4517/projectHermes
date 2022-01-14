import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi'
import { Link } from "react-router-dom";
import { HashRouter as HashRouter, Switch, Route } from "react-router-dom";
import { Godpage, Gods, TierListPage, Match, Home, ContactForm, Items } from "./"
import { color } from '@mui/system';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from "./SearchBarStuff/SearchBar";
import Player from "./PlayerPage/Player";
import OverviewDisplay from "./PlayerPage/OverviewDisplay";
import GodStatsDisplay from "./PlayerPage/GodStatsDisplay";
import { PlayerProvider } from "./PlayerPage/PlayerContext";
import DamageCalculator from "./DamageCalculator"



export const godsDict = {
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
  "Atlas": "Support",
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
  "Cliodhna": "Jungle",
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
  {
    path: "/",
    component: <Home />,
    god: "",
  },
  {
    path: "/Gods",
    component: <Gods />,
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
  }


]
Object.keys(godsDict).forEach((god) => {
  routes = [...routes, {
    path: "/".concat(god).replaceAll(" ", "_"),
    component: <Godpage god={god} role={godsDict[god]} />,
    "god": god,
  },
    // {
    //   path: "/".concat(god.replaceAll(" ", "_"), "/items"),
    //   component: <Items god={god} role={godsDict[god]}/>,
    //   "god": god,
    // }
  ]
})

const Root = styled(AppBar)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    backgroundColor: "#0b0b23",
    width: "100%",
  },
  [theme.breakpoints.up('sm')]: {
    backgroundColor: "#0b0b23",
  },
  [theme.breakpoints.up('lg')]: {
    backgroundColor: "#0b0b23",
  },
  [theme.breakpoints.down('md')]: {
    backgroundColor: "#0b0b23",
    width: "100%",
    paddingLeft: "125px"
  },
}));

const CustDrawer = styled(Drawer)(({ theme }) => ({
  padding: theme.spacing(1),
  bgColor: "#17172e",
  [theme.breakpoints.down('sm')]: {
    display: "none",
  },
  [theme.breakpoints.up('sm')]: {
  },
  [theme.breakpoints.up('lg')]: {
  },
  [theme.breakpoints.down("md")]: {
    width: "120px"

  },
  '& .MuiDrawer-paper': {
    backgroundColor: "#17172e",
    [theme.breakpoints.down("lg")]: {
      width: "120px"
      // width: "225px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "225px"
      // width: "225px",
    }
  }
}));

const Hamburger = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    backgroundColor: "#0b0b23",
    color: "000",
    display: "block",
    marginRight: "25px"
  },
  [theme.breakpoints.up('md')]: {
    backgroundColor: "#00FFFF",
    display: "none",
  },
  [theme.breakpoints.up('lg')]: {
    backgroundColor: "#0000FF",
    display: "none",
  },
}));


const drawerWidth = 200;
export default function PermanentDrawerLeft() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const routeComponents = routes.map(({ path, component }, key) => <Route exact path={path} component={() => component} key={key} />);
  return (
    <Box sx={{ display: 'flex' }}>
      {/* <CssBaseline /> */}
      <Root
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth + 20}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#17172e",
          paddingLeft: "0px",
          paddingRight: "0px"
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div"
            sx={{
              display: "flex",
              // position: "fixed",
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
              <Link to={"/"} style={{ marginLeft: "10px", paddingRight: "10px" }}>
                <img
                  src="https://i.imgur.com/3KNEQMP.png"
                  alt="SmiteStats Icon"
                  className="logo-icon-small"
                />
                Home
              </Link>
              <Link to={"/gods"} style={{ paddingRight: "10px" }}>Gods</Link>
              <Link to={"/tierlist"}>Tierlist</Link>
              {/* <Button
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          > */}
              {/* <MenuItem onClick={handleClose}><Link to={"/"}>Gods</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to={"/"}>Gods</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to={"/tierlist"}>tierlist</Link></MenuItem> */}
              {/* </Menu> */}
            </Hamburger>
            <SearchBar data={routes.slice(9)} />
          </Typography>
        </Toolbar>
      </Root>
      <CustDrawer
        sx={{
          width: "225px",
          flexShrink: 0,
          bgColor: "#17172e",
          '& .MuiDrawer-paper': {
            bgColor: "#17172e"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider sx={{
          color: "#bbbedb",
          bgColor: "#17172e"
        }} />
        <List
          sx={{
            paddingLeft: "10px",
            color: "#bbbedb",
            bgcolor: "#17172e",
            display: "flex",
            flexDirection: "column",
          }}>
          {["Home", "Gods", "Tierlist", "Contact", "Match", "Damage Calculator"].map((text, index) => {
            let route = text;
            let icon;
            if (text === "Home") {
              route = "";
              icon = <AiIcons.AiFillHome />
            }
            else if (text === "Gods") {
              icon = <GiIcons.GiPikeman />
            } else if (text === "Tierlist") {
              icon = <AiIcons.AiOutlineBars />
            }
            else if (text === "Contact") {
              icon = <AiIcons.AiFillMail />
            }
            else if (text === "Match") {
              icon = <GiIcons.GiSwordClash />
            }
            else if (text === "Damage Calculator") {
              icon = <GiIcons.GiSwordman />
            }
            else {
              route = text;
            }
            return (
              <>
                <Link
                  key={index} to={"/".concat((route).replaceAll(" ", "_"))}
                  className="god-link"
                  style={{ marginBottom: "20px", marginLeft: "5px" }}
                >
                  {icon}{text}
                </Link>
                {/* <br></br> */}
              </>
            )
          })}
        </List>
        <Divider />
      </CustDrawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: "100%" }}
      >
        <Toolbar />
        <PlayerProvider>
          <Typography>
            <Switch>
              {routeComponents}
            </Switch>
          </Typography>
        </PlayerProvider>
      </Box>
    </Box>
  );
}
