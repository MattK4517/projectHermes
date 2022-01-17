import React, { useContext } from "react";
import { DamageContext } from "./DamageContext";
import Picture from "./Picture";

export default function GodSelectionBox(props) {
  const [drop, allgods, board, setBoard] = useContext(DamageContext);
  return (
      <div className="god-selection" ref={drop}>
        {board.map((god) => {
          return (
            <>
              <div className="specific-image-container">
                <img src={god.url} alt={god.id} />
              </div>
              <strong className="god-name">{god.id}</strong>
            </>
          );
        })}
      </div>
  );
}
