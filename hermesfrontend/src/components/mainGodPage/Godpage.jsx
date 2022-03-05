import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Component.css";
import styled from "styled-components";
import useFetch from "../useFetch";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Items from "./Items";
import { FilterForm } from "../Filters/FilterForm";
import { DropDownFilter } from "../Filters/DropDownFilter";
import winRateColor from "./WinRateColor";
import { GodHeader } from "../mainGodPage/GodHeader";
import { BasicTabs } from "../mainGodPage/PageTabs";
import SearchBarGodPage from "../SearchBarStuff/SearchBarGodPage";
import { Helmet } from "react-helmet"

const godsDict = {
  "All Gods": "None",
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
  "Atlas": "Support",
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
  "Cliodhna": "Jungle",
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
]
Object.keys(godsDict).forEach((god) => {
  routes = [...routes, {
    path: "/".concat(god).replaceAll(" ", "_"),
    component: <Godpage god={god} role={godsDict[god]}/>,
    "god": god,
  },
  // {
  //   path: "/".concat(god.replaceAll(" ", "_"), "/items"),
  //   component: <Items god={god} role={godsDict[god]}/>,
  //   "god": god,
  // }
]
})

const linkDict = {
  "Achilles": "https://i.imgur.com/KoU1bup.jpg",
  "Agni": "https://i.imgur.com/DNzygMe.jpg",
  "Ah Muzen Cab": "https://i.imgur.com/mAPxdzA.jpg",
  "Ah Puch": "https://i.imgur.com/xX16VcU.jpg",
  "Amaterasu": "https://i.imgur.com/HcxQ8sd.jpg",
  "Anhur": "https://i.imgur.com/c4ex2dq.jpg",
  "Anubis": "https://i.imgur.com/CuZgOab.jpg",
  "Ao Kuang": "https://i.imgur.com/0n7LLuG.jpg",
  "Aphrodite": "https://i.imgur.com/AaDJFPx.jpg",
  "Apollo": "https://i.imgur.com/MTnDzUl.jpg",
  "Arachne": "https://i.imgur.com/3kjOdcl.jpg",
  "Ares": "https://i.imgur.com/DBcm5f7.jpg",
  "Artemis": "https://i.imgur.com/bT4b5gc.jpg",
  "Artio": "https://i.imgur.com/pwTJrq3.jpg",
  "Athena": "https://i.imgur.com/8uCHDlz.jpg",
  "Atlas": "https://i.imgur.com/uCMJ541.jpg",
  "Awilix": "https://i.imgur.com/fZh25Mc.jpg",
  "Baba Yaga": "https://i.imgur.com/6tquTDY.jpg",
  "Bacchus": "https://i.imgur.com/lL8RPfw.jpg",
  "Bakasura": "https://i.imgur.com/5gIjFo9.jpg",
  "Baron Samedi": "https://i.imgur.com/cChes0b.jpg",
  "Bastet": "https://i.imgur.com/N7gykrw.jpg",
  "Bellona": "https://i.imgur.com/i1r4nt4.jpg",
  "Cabrakan": "https://i.imgur.com/HmMYUJU.jpg",
  "Camazotz": "https://i.imgur.com/DXY2jSE.jpg",
  "Cerberus": "https://i.imgur.com/9s5zFdr.jpg",
  "Cernunnos": "https://i.imgur.com/IquJH93.jpg",
  "Chaac": "https://i.imgur.com/slznuZW.jpg",
  "Chang\'e": "https://i.imgur.com/nTVHD0y.jpg",
  "Charybdis": "https://i.imgur.com/AGvDlVi.jpg",
  "Chernobog": "https://i.imgur.com/8zvnYu5.jpg",
  "Chiron": "https://i.imgur.com/cEygNc6.jpg",
  "Chronos": "https://i.imgur.com/4CZSIPa.jpg",
  "Cliodhna": "https://i.imgur.com/PD9N9pl.jpg",
  "Cthulhu": "https://i.imgur.com/3iKo30i.jpg",
  "Cu Chulainn": "https://i.imgur.com/4eFDG0e.jpg",
  "Cupid": "https://i.imgur.com/OLY1TDP.jpg",
  "Da Ji": "https://i.imgur.com/oJpXD2R.jpg",
  "Danzaburou": "https://i.imgur.com/PeLPV06.jpg",
  "Discordia": "https://i.imgur.com/bTwDxKV.jpg",
  "Erlang Shen": "https://i.imgur.com/nlcwZ2T.jpg",
  "Eset": "https://i.imgur.com/BjXX0Wi.png",
  "Fafnir": "https://i.imgur.com/43Yhg9Q.jpg",
  "Fenrir": "https://i.imgur.com/S8lzwSw.jpg",
  "Freya": "https://i.imgur.com/NSDIXDa.jpg",
  "Ganesha": "https://i.imgur.com/WgM5ytq.jpg",
  "Geb": "https://i.imgur.com/yjoLvUY.jpg",
  "Gilgamesh": "https://i.imgur.com/grBatk2.jpg",
  "Guan Yu": "https://i.imgur.com/NeDl0HH.jpg",
  "Hachiman": "https://i.imgur.com/JydMpnq.jpg",
  "Hades": "https://i.imgur.com/giljWP0.jpg",
  "He Bo": "https://i.imgur.com/467ruyn.jpg",
  "Heimdallr": "https://i.imgur.com/AWpOHTw.jpg",
  "Hel": "https://i.imgur.com/KLeqa2y.jpg",
  "Hera": "https://i.imgur.com/P6S6Tyc.jpg",
  "Hercules": "https://i.imgur.com/RWqvXi9.jpg",
  "Horus": "https://i.imgur.com/mA0Vom6.jpg",
  "Hou Yi": "https://i.imgur.com/AnJgIRB.jpg",
  "Hun Batz": "https://i.imgur.com/PWS1kZ3.jpg",
  "Izanami": "https://i.imgur.com/t5c7f2K.jpg",
  "Janus": "https://i.imgur.com/RPotbAL.jpg",
  "Jing Wei": "https://i.imgur.com/eaJX1IP.jpg",
  "Jormungandr": "https://i.imgur.com/8COqM2r.jpg",
  "Kali": "https://i.imgur.com/XVWHFVt.jpg",
  "Khepri": "https://i.imgur.com/mQrlTRL.jpg",
  "King Arthur": "https://i.imgur.com/EUcSN1c.jpg",
  "Kukulkan": "https://i.imgur.com/QWD7oco.jpg",
  "Kumbhakarna": "https://i.imgur.com/qgFK672.jpg",
  "Kuzenbo": "https://i.imgur.com/efIAMWB.jpg",
  "Loki": "https://i.imgur.com/vmiaaRh.jpg",
  "Medusa": "https://i.imgur.com/ilPujED.jpg",
  "Mercury": "https://i.imgur.com/P7CJ5UQ.jpg",
  "Merlin": "https://i.imgur.com/abi67RB.jpg",
  "Morgan Le Fay": "https://i.imgur.com/QZ4jZjU.jpg",
  "Mulan": "https://i.imgur.com/ZiNzuWe.jpg",
  "Ne Zha": "https://i.imgur.com/Sl4glQA.jpg",
  "Neith": "https://i.imgur.com/IFI8nNw.jpg",
  "Nemesis": "https://i.imgur.com/e3CNDNb.jpg",
  "Nike": "https://i.imgur.com/mkkL7qX.jpg",
  "Nox": "https://i.imgur.com/u6ra0GF.jpg",
  "Nu Wa": "https://i.imgur.com/VhCooqS.jpg",
  "Odin": "https://i.imgur.com/VBaP7Vz.jpg",
  "Olorun": "https://i.imgur.com/7jYk5RU.jpg",
  "Osiris": "https://i.imgur.com/7JqDGsP.jpg",
  "Pele": "https://i.imgur.com/l5q55hc.jpg",
  "Persephone": "https://i.imgur.com/rK8EpOK.jpg",
  "Poseidon": "https://i.imgur.com/kvNTrf3.jpg",
  "Ra": "https://i.imgur.com/vipeJLL.jpg",
  "Raijin": "https://i.imgur.com/qwQnQyT.jpg",
  "Rama": "https://i.imgur.com/4ebZjis.jpg",
  "Ratatoskr": "https://i.imgur.com/rFfc7dB.jpg",
  "Ravana": "https://i.imgur.com/kKfiIrt.jpg",
  "Scylla": "https://i.imgur.com/7NPNf46.jpg",
  "Serqet": "https://i.imgur.com/9odFATg.jpg",
  "Set": "https://i.imgur.com/7hjbLls.jpg",
  "Shiva": "https://i.imgur.com/R2QEKo8.jpg",
  "Skadi": "https://i.imgur.com/097p6i9.jpg",
  "Sobek": "https://i.imgur.com/LIU5dYN.png",
  "Sol": "https://i.imgur.com/H6PFyOw.jpg",
  "Sun Wukong": "https://i.imgur.com/fkQAznu.jpg",
  "Susano": "https://i.imgur.com/iYwz8M7.jpg",
  "Sylvanus": "https://i.imgur.com/1yR9had.jpg",
  "Terra": "https://i.imgur.com/0PBRilP.jpg",
  "Thanatos": "https://i.imgur.com/6acnOIq.jpg",
  "The Morrigan": "https://i.imgur.com/lX1FsDS.jpg",
  "Thor": "https://i.imgur.com/dYIPSkM.jpg",
  "Thoth": "https://i.imgur.com/l6NYsol.jpg",
  "Tiamat": "https://i.imgur.com/XFyqECN.jpg",
  "Tsukuyomi": "https://i.imgur.com/YntBuSV.jpg",
  "Tyr": "https://i.imgur.com/OZ43lHw.jpg",
  "Ullr": "https://i.imgur.com/pzKIi3p.jpg",
  "Vamana": "https://i.imgur.com/RYo9mkm.jpg",
  "Vulcan": "https://i.imgur.com/uGt5yTN.jpg",
  "Xbalanque": "https://i.imgur.com/Ny89l8l.jpg",
  "Xing Tian": "https://i.imgur.com/EPD67l6.jpg",
  "Yemoja": "https://i.imgur.com/N3MPZdc.jpg",
  "Ymir": "https://i.imgur.com/QajyfQZ.jpg",
  "Zeus": "https://i.imgur.com/M6EUYxz.jpg",
  "Zhong Kui": "https://i.imgur.com/aJBjZJE.jpg"
}



const ImageDiv = styled.div`
  background-position: 25% -15%;
  background-repeat: no-repeat;
  background-image:
    radial-gradient(400px 300px at 65% 20%, rgba(7, 7, 32, 0) 0%, #070720 100%),
    linear-gradient(to right, #070720 30%, rgba(7, 7, 32, 0.6) 100%),
    url(${(props) =>
      props.url
        ? props.url.replace("icons", "cards")
        : "https://i.ytimg.com/vi/xAPsmI_zDZs/maxresdefault.jpg"});

`;


function Godpage(props) {
  const pagegod = props.god.replaceAll("_", " ");
  const role = props.role;
  var [url, seturl] = useState(0);
  const [displaygod, setgod] = useState(0);
  const [abilities, setabilities] = useState([]);
  const [patch, setPatch] = useState("9.2")
  const [matchup, setMatchup] = useState("None")
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
    "Platinum+",
    "Diamond",
    "Diamond+",
    "Masters",
    "Grandmaster",
    "All Ranks",
  ]);

  const [tab, setTab] = useState("Build");
  const [dispRole, setrole] = useState(role);
  const [dispRank, setrank] = useState("All Ranks");
  const [tier, setTier] = useState("")
  const [banrate, setbanrate] = useState(0);
  const [pickrate, setpickrate] = useState(0);
  const [winrate, setwinrate] = useState(0);
  const [mode, setMode] = useState("Ranked")
  const modes = ["Casual", "Ranked"]

  useEffect(() => {
    fetch("/api/main/".concat(pagegod, "/", dispRole, "/", dispRank, "/", patch, "/", mode, "/", matchup)).then((res) =>
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
  }, [dispRole, dispRank, patch, mode, matchup]);

  useEffect(() => {
    fetch("/api/".concat(pagegod, "/abilities")).then((res) =>
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
    <Helmet>
      <meta charSet="utf-8" />
      <meta property={"og:image"} content={url}/>
      <meta name="description" content={`${pagegod} Build & Matchups Best Stats for SMITE patch: ${patch}`} />
      <title>{`${pagegod} Build & Matchups`}</title>
    </Helmet>
    <ImageDiv className="page-content" url={linkDict[pagegod]}>
      <div className="Godpage">
        <div className="container">
          <div className="god-container build_page">
            <div className="row align-items-center my-5">
              {/* <div class="col-lg-5"></div> */}
              <h1 className="font-weight-light"></h1>

              <GodHeader
                god={pagegod}
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
                      filter={dispRole}
                      god={pagegod}
                      filters={roles}
                      setFilter={setrole}
                    />
                    {/* </div> */}
                    <div className={mode}>
                        <FilterForm
                          filter={dispRank}
                          god={pagegod}
                          filters={ranks}
                          setFilter={setrank}
                        />
                    </div>
                    <FilterForm
                          filter={patch}
                          god={pagegod}
                          filters={["9.2", "9.1", "8.12"]}
                          setFilter={setPatch}
                        />
                    {/* <DropDownFilter changePatch={setPatch} patch={patch} style={{color: "white"}}/> */}
                    <FilterForm
                      filter={mode}
                      god={pagegod}
                      filters={modes}
                      setFilter={setMode}
                      rankSet={setrank}
                    />
                    <SearchBarGodPage data={routes} changeMatchup={setMatchup} matchup={matchup}/>
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
                matchup={matchup}
                mode={mode}
                />
            </div>
          </div>
        </div>
      </div>
      </ImageDiv>
    </>
  );
}

export default Godpage;
