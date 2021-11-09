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
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from "react-router-dom";
import { HashRouter as HashRouter, Switch, Route} from "react-router-dom";
import { Godpage, Gods, TierListPage, Match, Home, ContactForm, Items } from "./"
import { color } from '@mui/system';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



const godsDict = {
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
    {
      path: "/",
      component: <Home />,
    },
    {
      path: "/Gods",
      component: <Gods />,
    },
    {
      path: "/tierlist",
      component: <TierListPage />,
    },
    {
      path: "/contact",
      component: <ContactForm />
    },
    {
      path: "/match",
      component: <Match />
    }
  ]
  Object.keys(godsDict).forEach((god) => {
    routes = [...routes, {
      path: "/".concat(god).replaceAll(" ", "_"),
      component: <Godpage god={god} role={godsDict[god]}/>
    },
    {
      path: "/".concat(god.replaceAll(" ", "_"), "/items"),
      component: <Items god={god} role={godsDict[god]}/>
    }
  ]
  })

const Root = styled(AppBar)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    backgroundColor: "#0b0b23",
    width: "100%"
  },
  [theme.breakpoints.up('sm')]: {
    backgroundColor: "#0b0b23",
  },
  [theme.breakpoints.up('lg')]: {
    backgroundColor: "#0b0b23",
  },
}));

const CustDrawer = styled(Drawer)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    backgroundColor: "#FF0000",
    display:  "none",
  },
  [theme.breakpoints.up('sm')]: {
    backgroundColor: "#00FFFF",
  },
  [theme.breakpoints.up('lg')]: {
    backgroundColor: "#0000FF",
  },
}));

const Hamburger = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    backgroundColor: "#FFF",
    color: "000",
    display: "block",
    marginRight: "25px"
  },
  [theme.breakpoints.up('sm')]: {
    backgroundColor: "#00FFFF",
    display:  "none",
  },
  [theme.breakpoints.up('lg')]: {
    backgroundColor: "#0000FF",
    display:  "none",
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
const routeComponents = routes.map(({path, component}, key) => <Route exact path={path} component={() => component} key={key} />);
  return (
    <Box sx={{ display: 'flex'}}>
      {/* <CssBaseline /> */}
      <Root
        position="fixed"
        sx={{ 
            width: `calc(100% - ${drawerWidth+20}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "drawer.backgroundColor",
         }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" 
          sx={{
            display: "flex"
          }}
          >
          <Hamburger>
          <Button
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
          >
            <MenuItem onClick={handleClose}><Link to={"/"}>Gods</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to={"/Gods"}>Gods</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to={"/tierlist"}>tierlist</Link></MenuItem>
          </Menu>
        </Hamburger>
          <Link to={"/"}>SmiteStats.gg</Link>
          </Typography>
        </Toolbar>
      </Root>
      <CustDrawer
        sx={{
          width: "drawer.width",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 225,
            boxSizing: 'border-box',
            bgcolor: "#17172e",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider sx={{
            color: "#bbbedb"
        }}/>
        <List
        sx={{
            paddingLeft: "10px",
            color: "#bbbedb",
            bgcolor: "#17172e",
        }}>
          {['Home', 'Gods', 'Tierlist', "Contact",'Match'].map((text, index) => {
            let route ="";
            if (text === "Home"){
              route = "";
            }
            else {
              route = text;
            }
            return (
                <>
              <Link key = {index} to={"/".concat((route).replaceAll(" ","_"))} 
              className="god-link"
              >{text}</Link>
              <br></br>
              </>
            )
    })}
        </List>
        <Divider />
      </CustDrawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: "100%"}}
      >
        <Toolbar />
            <Typography>
                <Switch>
                    {routeComponents}
                </Switch>
            </Typography>
      </Box>
    </Box>
  );
}
