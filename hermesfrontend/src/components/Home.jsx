import { Box, Container } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import BuildPage from "./mainGodPage/testPage"
import RSSFeeder from "./RssFeed"

function Home() {
  return (
    <Container maxWidth="100%">
        <BuildPage>

        </BuildPage>
    </Container>
  );
}

export default Home;