import React, { Component, useState, useContext } from "react";
import { PropTypes } from "prop-types";
import Tab from "./Tab";
import { MainContext } from "../mainGodPage/MainContext";

export default function TierListTabs(props) {
  const { tab } = useContext(MainContext);

  const [activeTab, setActiveTab] = useState(props.tab || tab || props.children[0].props.label)

  const onClickTabItem = (tab) => {
    props.changeTableType(tab)
    setActiveTab(tab);
  }
  return (
    <div className="tabs">
      <ol className="tab-list">
        {props.children.map((child) => {
          const { label } = child.props;
          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className="tab-content">
        {props.children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};