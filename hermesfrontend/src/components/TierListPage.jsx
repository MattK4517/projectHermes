import TierListTabs from "./Tabs/TierListTabs";
import TierList from "./Tierlists/TierList";
import CombatTierList from "./Tierlists/CombatTierList";
import ObjectiveTierList from "./Tierlists/ObjectiveTierList";
import DuoLaneTierList from "./Tierlists/DuoLaneTierList";
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'


function TierListPage() {
    const [tableType, setTableType] = useState("Regular")
    let patch = "1"
    return (
      <>
        <Helmet>
        <meta charSet="utf-8" />
        <title>{`SMITE ${tableType} Tier List for ${patch}`}</title>
        </Helmet>
        <div id="page-content">
        <div style={{ width: "100%"}}>
          <div id="main-content" className="collapsed">
            <div id="content-wrapper">
              <div id="content">
                <div class="stats-tables-page">
                  <div id="stats-tables-container-ID" className="stats-tables-container content-side-padding" style={{paddingTop: "100px"}}>
                    <div className="title-header">
                        <h1 className="tier-list">
                        <span class="title-header_main">{tableType} Stats Tier List</span>
                        {/* <span class="title-header_secondary">for {role}, {dispRank.replaceAll("_", " ")}</span> */}
                        </h1>
                    </div>
                    <TierListTabs style={{paddingTop: "10px"}} changeTableType={setTableType}>
                    <div label="Regular" style={{color: "white"}}>
                      <TierList tableType={"Regular"} />
                    </div>
                    <div label="Combat" style={{color: "white"}}>
                      <CombatTierList tableType={"Combat"} />
                    </div>
                    <div label="Objective" style={{color: "white"}}>
                      <ObjectiveTierList tableType={"Objective"} />
                    </div>
                    <div label="Duos" style={{color: "white"}}>
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
    )
}

export default TierListPage;
