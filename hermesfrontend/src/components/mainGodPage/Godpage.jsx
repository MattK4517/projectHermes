import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Component.css";
import styled from "styled-components";
import useFetch from "../useFetch";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Menu from '@material-ui/core/Menu';
import Items from "./Items";
import { FilterForm } from "../Filters/FilterForm";
import { DropDownFilter } from "../Filters/DropDownFilter";
import winRateColor from "./WinRateColor";
import { GodHeader } from "../mainGodPage/GodHeader";
import { BasicTabs } from "../mainGodPage/PageTabs";


const ImageDiv = styled.div`
  background-position: 75% -100%;
  background: repeat no-repeat,
    radial-gradient(400px 200px at 75% 20%, rgba(7, 7, 32, 0) 0%, #070720 100%),
    linear-gradient(to right, #070720 30%, rgba(7, 7, 32, 0.6) 100%),
    url(${(props) =>
      props.url
        ? props.url.replace("icons", "cards")
        : "https://i.ytimg.com/vi/xAPsmI_zDZs/maxresdefault.jpg"});
`;


function Godpage(god) {
  const pagegod = god.god.replaceAll("_", " ");
  const role = god.role;
  var [url, seturl] = useState(0);
  const [displaygod, setgod] = useState(0);
  const [abilities, setabilities] = useState([]);
  const [patch, setPatch] = useState("8.10")
  const [roles, setroles] = useState([
    "Solo",
    "Jungle",
    "Mid",
    "Support",
    "Carry",
  ]);
  const [ranks, setranks] = useState([
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Masters",
    "Grandmaster",
    "All_Ranks",
  ]);

  const [tab, setTab] = useState("Build");
  const [dispRole, setrole] = useState(role);
  const [dispRank, setrank] = useState("All Ranks");
  const [tier, setTier] = useState("S")
  const [banrate, setbanrate] = useState(0);
  const [pickrate, setpickrate] = useState(0);
  const [winrate, setwinrate] = useState(0);

  useEffect(() => {
    fetch("/main/".concat(pagegod, "/", dispRole, "/", dispRank, "/", patch)).then((res) =>
      res.json().then((data) => {
        setgod(pagegod);
        seturl(data.url);
        setbanrate(((data.godBans / data.totalMatches) * 100).toFixed(2));
        setpickrate(data.pickRate);
        setwinrate(data.win_rate);
        setTier(data.tier)
        // setTier(data.tier)
      })
    );
  }, [dispRole, dispRank, patch]);

  useEffect(() => {
    fetch("/".concat(pagegod, "/abilities")).then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setabilities((abilities) => [
            ...abilities,
            {
              name: data[key].name,
              url: data[key].url,
            },
          ]);
        });
      })
    );
  }, []);
  return (
    <>
    <div className="page-content">
      <div className="Godpage">
        <div className="container">
          <ImageDiv className="god-container build_page" url={url}>
            <div className="row align-items-center my-5">
              {/* <div class="col-lg-5"></div> */}
              <h1 className="font-weight-light"></h1>

              <GodHeader
                god={displaygod}
                url={url}
                tier={tier}
                role={dispRole}
                rank={dispRank}
                abilities={abilities}
                patch={patch}
                tab={tab}
              />
              <div className="filter-manager">
                <div className="filter-width-wrapper">
                  <div className="filter-manager_container">
                    <div className="filter-manager_label">
                      <span style={{ color: "white" }}>Stat Filters</span>
                    </div>
                    {/* <div className="role-filter-container"> */}
                    <FilterForm
                      filter={role}
                      god={pagegod}
                      filters={roles}
                      setFilter={setrole}
                    />
                    {/* </div> */}
                        <FilterForm
                          filter={dispRank}
                          god={pagegod}
                          filters={ranks}
                          setFilter={setrank}
                        />
                    <DropDownFilter changePatch={setPatch} patch={"8.10"} style={{color: "white"}}/>
                  </div>
                </div>
              </div>
              <BasicTabs 
                pagegod={pagegod} 
                role={dispRole} 
                rank={dispRank} 
                patch={patch} 
                changeTab={setTab}
                winRate={winrate}
                pickRate={pickrate}
                banRate={banrate}
                />
            </div>
          </ImageDiv>
        </div>
      </div>
      </div>
    </>
  );
}

export default Godpage;
