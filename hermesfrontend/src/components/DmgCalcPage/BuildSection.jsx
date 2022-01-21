import React, { useEffect, useState, useContext } from "react";
import { DamageContext } from "./DamageContext";

export default function BuildSection(props) {
  const [
    drop,
    allgods,
    board,
    setBoard,
    god,
    setGod,
    build,
    setBuild,
    dropItem,
  ] = useContext(DamageContext);
  return (
    <div
      className="build-container items"
      ref={dropItem}
      style={{ backgroundColor: "#17172e", minHeight: "75px" }}
    >
      {build.map((item, index) => {
        let url = `https://webcdn.hirezstudios.com/smite/item-icons/${item
          .replaceAll("'", "")
          .replaceAll(" ", "-")
          .toLowerCase()}.jpg`;
        return (
          <div className="item-image">
            <div className="item-image-div">
              <img
                src={url}
                alt={item}
                style={{ border: "2px solid black", borderRadius: "5px" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
