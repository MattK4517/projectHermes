import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter as HashRouter, Switch, Route } from "react-router-dom";
import {
  MiniDrawer,
} from "./components";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#191937",
          color: "white",
        },
        selected: {
          color: "purple",
          backgroundColor: "red",
        },
        // "selected.hover": {
        //   color: "red"
        // }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: "0px",
          focus: "red"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          display: "none"
        },
      }
    },
  },
  // .MenuItem.Mui-selected {
  //   styleOverrides: {
  //     backgroundColor: "teal"
  //   }
  // },
});

export default function App() {
    // const routeComponents = routes.map(({path, component}, key) => <Route exact path={path} component={() => component} key={key} />);
    return (
      <div className="App">
        <HashRouter>
          <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
              <MiniDrawer />
            </ThemeProvider>
          </DndProvider>
        </HashRouter>
      </div>
    );
}
