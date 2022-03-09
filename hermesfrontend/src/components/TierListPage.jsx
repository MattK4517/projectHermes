import TierListTabs from "./Tabs/TierListTabs";
import TierList from "./Tierlists/TierList";
import CombatTierList from "./Tierlists/CombatTierList";
import ObjectiveTierList from "./Tierlists/ObjectiveTierList";
import DuoLaneTierList from "./Tierlists/DuoLaneTierList";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { TierListContext } from "./Tierlists/TierListContext";

export default function TierListPage() {
  const [tableType, setTableType] = useState("Regular");
  const [
    god,
    setGod,
    mode,
    setMode,
    patch,
    setPatch,
    rank,
    setRank,
    role,
    setRole,
    topLink,
    setTopLink,
  ] = useContext(TierListContext);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`SMITE ${tableType} Tier List for ${patch}`}</title>
      </Helmet>
      <div id="page-content">
        <div style={{ width: "100%" }}>
          <div id="main-content" className="collapsed">
            <div id="content-wrapper">
              <div id="content">
                <div className="content-side-padding background-image-container">
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div class="bg-container">
                      <img class="background-image" src={topLink} />
                    </div>
                    <div class="gradient-container">
                      <div class="gradient"></div>
                    </div>
                  </div>
                </div>
                <div class="stats-tables-page">
                  <div
                    id="stats-tables-container-ID"
                    className="stats-tables-container content-side-padding"
                    style={{ paddingTop: "100px" }}
                  >
                    <div className="title-header">
                      <h1 className="tier-list">
                        <span class="title-header_main">
                          <h2 className="god-label">
                            <span>
                              <b style={{ color: "white" }}>
                                {tableType} Stats Tier List
                              </b>
                            </span>
                            <span>&nbsp;for SMITE patch {patch}</span>
                            <span>&nbsp;{rank}, {role}</span>
                          </h2>
                        </span>
                        {/* <span class="title-header_secondary">for {role}, {dispRank.replaceAll("_", " ")}</span> */}
                      </h1>
                    </div>
                    <TierListTabs
                      style={{ paddingTop: "10px" }}
                      changeTableType={setTableType}
                    >
                      <div label="Regular" style={{ color: "white" }}>
                        <TierList tableType={"Regular"} />
                      </div>
                      <div label="Combat" style={{ color: "white" }}>
                        <CombatTierList tableType={"Combat"} />
                      </div>
                      <div label="Objective" style={{ color: "white" }}>
                        <ObjectiveTierList tableType={"Objective"} />
                      </div>
                      <div label="Duos" style={{ color: "white" }}>
                        <DuoLaneTierList tableType={"Duos"} />
                      </div>
                    </TierListTabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
