import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Component.css";
import Graph from "./Graphs";
import SearchBarGodsDisplay from "./SearchBarStuff/SearchBarGodsDisplay";

export function AllGodsDisplay(props) {
  return (
    <div className="gods-container">
      {props.gods.map((god, index) => {
        console.log(god);
        return (
          <Link
            key={index}
            to={"/"}
            // to={"/".concat(god.name.replaceAll(" ", "_"))}
            className="god-link"
          >
            <div
              className={god.wins ? "hide god-name" : "god-name"}
              style={{ fontSize: "14px" }}
            >
              {god.wins} | {god.games} | {god.winRate}%
            </div>
            <figure className="snip0015">
              <img
                className="god-face"
                src={god.url || god.godSkin_URL}
                alt={god.name || god.skin_name}
                style={{ width: "100%" }}
              />
              <figcaption>
                <p>Stats for {god.name || god.skin_name}</p>
              </figcaption>
            </figure>
            <div className="god-name">{god.name || god.skin_name}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default function GodsScreen(props) {
  const [allgods, setallgods] = useState([]);

  useEffect(() => {
    fetch("/api/gods").then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setallgods((allgods) => [
            ...allgods,
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
    <div className="content">
      <div className="god-home-page">
        <div className="god-home content-side-pad">
          <div className="title-header">
            <h1 className="tier-list">Smite Gods Search</h1>
            <h2 className="subtitle">Find the best builds for every god!</h2>
            <div className="show">
              <SearchBarGodsDisplay />
            </div>
          </div>
          <AllGodsDisplay gods={allgods} />
        </div>
      </div>
    </div>
  );
}
