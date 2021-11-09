import React, {useState} from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter as HashRouter, Switch, Route} from "react-router-dom";
import { Godpage, Gods, TierListPage, Match, Home, ContactForm, Items, MiniDrawer } from "./components";
import { TierList } from "./components/Tierlists/TierList";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});


class App extends React.Component {
  render () {
    // const routeComponents = routes.map(({path, component}, key) => <Route exact path={path} component={() => component} key={key} />);
  return (
    <div className="App">
      <HashRouter>
        <div className="page-content">
        <ThemeProvider theme={theme}>
          <MiniDrawer />
        </ThemeProvider>
        </div>
      </HashRouter>
    </div>
  );
        }
}

export default App;
