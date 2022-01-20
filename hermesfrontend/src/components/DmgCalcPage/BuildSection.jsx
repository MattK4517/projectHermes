import React, { useEffect, useState, useContext } from "react";
import { DamageContext } from "./DamageContext";


export default function BuildSection(props) {
    const [drop, allgods, board, setBoard, god, setGod, build, setBuild, dropItem] =
    useContext(DamageContext);
    return (
        <div className="build-selection" ref={dropItem}>
        {build.map((item, index) => {
        let url = `https://webcdn.hirezstudios.com/smite/item-icons/${item
        .replaceAll("'", "")
        .replaceAll(" ", "-")
        .toLowerCase()}.jpg`;
          return (
          <div
            style={{
              maxHeight: "350px",
              maxWidth: "750px",
              color: "#E6E6FA",
              alignItems: "left",
              fontSize: "14px",
            }}
          >
              <div className="specific-image-container">
                <img src={url} alt={item} />
              </div>
              <strong className="god-name">{item}</strong>
            </div>
          );
        })}
        </div>
        )
}