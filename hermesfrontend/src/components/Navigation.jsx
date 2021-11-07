import React, {useState} from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter as HashRouter, Switch, Route} from "react-router-dom";
import {Godpage, Gods, TierListPage, Match, Home, ContactForm, Items } from "./components";
import { TierList } from "./components/Tierlists/TierList";
import styled from 'styled-components';

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";



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

const drawerWidth = 220;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonIconClosed: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(0deg)"
  },
  menuButtonIconOpen: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(180deg)"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.unit,
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  grow: {
    flexGrow: 1
  }
});

class Navbar extends React.Component {
  state = {
    open: false,
    anchorEl: null
  };

  handleDrawerOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const routeComponents = routes.map(({path, component}, key) => <Route exact path={path} component={() => component} key={key} />);
    return (
      <HashRouter>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classes.appBar}
          fooJon={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open
          })}
        >
          <Toolbar disableGutters={true}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classes.menuButton}
            >
              <MenuIcon
                classes={{
                  root: this.state.open
                    ? classes.menuButtonIconOpen
                    : classes.menuButtonIconClosed
                }}
              />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.grow}
              noWrap
            >
              SmiteStats.gg
            </Typography>
            <div>
              <IconButton
                aria-owns={open ? "menu-appbar" : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open
            })
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar} />
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        {/* <main className={classes.content}> */}
          {/* <div className={classes.toolbar} /> */}
            <div className="kasjfe">
              <Godpage god="Achilles" role="Solo" />
            </div>
        {/* </main> */}
      </div>
      </HashRouter>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Navbar);
