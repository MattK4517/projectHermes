import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HashRouter as HashRouter, Switch, Route } from "react-router-dom";
import {
  MiniDrawer,
} from "./components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
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
          color: "white",
          "&.Mui-selected": {
            backgroundColor: "#191937",
            color: "white",
          }
        },
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


const queryClient = new QueryClient()
export default function App() {
  // const routeComponents = routes.map(({path, component}, key) => <Route exact path={path} component={() => component} key={key} />);
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
              <MiniDrawer />
            </ThemeProvider>
          </DndProvider>
        </HashRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}
