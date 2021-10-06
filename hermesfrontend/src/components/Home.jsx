import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <div className="home-image">
        <div className="new-god content-section">
          <h3>
            NEW GOD CHARYBDIS
          </h3>
          <h4>
            <Link to={"/".concat(("Charybdis").replaceAll(" ","_"))}>See how they stack up!</Link> 
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Home;