import React, { useContext } from "react";
import { useDrag } from "react-dnd";
import { DamageContext } from "./DamageContext";

function Picture({ id, url }) {
  const [drop, allgods, board, setBoard, god, setGod, build, setBuild, dropItem, itemType, setItemType] =
  useContext(DamageContext);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [itemType]);
  return (
    <div className="check-box_wrapper">
      <div className="god-face" style={{ marginLeft: "10px" }}>
        <div style={{ height: "30px", width: "30px", borderRadius: "3px" }}>
          <img
            ref={drag}
            src={url}
            width="150px"
            style={{
              height: "48px",
              width: "48px",
              transform: "scale(0.625)",
              transformOrigin: "0px 0px 0px",
            }}
          />
        </div>
      </div>
      <strong className="god-name">{id}</strong>
    </div>
  );
}

export default Picture;