import TierListTabs from "./TierListTabs";
import TierList from "./Tierlists/TierList";
import CombatTierList from "./Tierlists/CombatTierList";
import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';


function TierListPage() {
    const [initData, setInitData] = useState([])
    const [tableType, setTableType] = useState("Regular")
    const [counterMatchups, setCounterMatchups] = useState([]);
    
    return (
        <div id="page-content">
        <div style={{ width: "100%"}}>
          <div id="main-content" className="collapsed">
            <div id="content-wrapper">
              <div id="content">
                <div class="stats-tables-page">
                  <div id="stats-tables-container-ID" className="stats-tables-container content-side-padding" style={{paddingTop: "100px"}}>
                    <div className="title-header">
                        <h1 className="tier-list">
                        <span class="title-header_main">{tableType} Tier List</span>
                        {/* <span class="title-header_secondary">for {role}, {dispRank.replaceAll("_", " ")}</span> */}
                        </h1>
                        <span style={{color: "white"}}>WIP, click on a role to get data to display</span>
                    </div>
                    <TierListTabs>
                    <div label="Tier List" style={{color: "white"}}>
                      <TierList tableType={"Regular"} />
                    </div>
                    <div label="Combat" style={{color: "white"}}>
                      <CombatTierList tableType={"Combat"} />
                    </div>
                    </TierListTabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default TierListPage;
