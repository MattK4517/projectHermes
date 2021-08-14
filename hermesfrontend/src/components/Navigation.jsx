import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar } from "./";
import * as FaIcons from 'react-icons/fa';

function Navigation(props) {
  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Navbar />
          <Link class="navbar-brand" to="/">
            Smitestats.gg
          </Link>
    
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);