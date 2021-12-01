import { Box, Container } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import RSSFeeder from "./RssFeed";
function Home() {
  return (
    <RSSFeeder />
    // <Container maxWidth="100%">
    //   <Box>
    //     <div className="home">
    //       <div className="home-image">
    //         <div className="new-god content-section">
    //           <h3>
    //             NEW GOD CHARYBDIS
    //           </h3>
    //           <h4>
    //             <Link to={"/".concat(("Charybdis").replaceAll(" ","_"))}>See how they stack up!</Link> 
    //           </h4>
    //         </div>
    //       </div>
    //     </div>
    //   </Box>
    // </Container>
  );
}

export default Home;