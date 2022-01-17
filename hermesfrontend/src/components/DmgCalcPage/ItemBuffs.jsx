import React, { useState } from "react"

export default function ItemBuffs(props) {
    const [buffs, setBuffs] = useState(["Belt of Frenzy", "Potion of Power", "Elixir of Power"])
  return (
    <div className="content-section">
      <div className="content-section_header">Damage Buffs</div>
      <form className="buff-checkbox">
          {buffs.map(buff => {
              return (
                <div className="check-box_wrapper">
                <input name="isGoing" type="checkbox" />
                <div className="god-face" style={{marginLeft: "10px"}}>
                  <div style={{ height: "30px", width: "30px", borderRadius: "3px" }}>
                    <img
                      src={
                        `https://webcdn.hirezstudios.com/smite/item-icons/${buff.toLowerCase().replaceAll(" ", "-")}.jpg`
                      }
                      alt={buff}
                      style={{
                        height: "48px",
                        width: "48px",
                        transform: "scale(0.625)",
                        transformOrigin: "0px 0px 0px",
                      }}
                    />
                  </div>
                </div>
                <strong className="god-name">{buff}</strong>
              </div>
              )
          })}
      </form>
    </div>
  );
}
