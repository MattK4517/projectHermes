// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import "../Component.css";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { PlayerContext } from "../PlayerPage/PlayerContext";

// class GodsDisplay extends React.Component {
//     render() {
//         return (
//             <InfiniteScroll
//             dataLength={1}
//             height={"550px"}
//             >
//             <div className="gods-container">
//             <form onChange={(e) => (this.props.setGod(e.target.name))}>
//             {this.props.gods.map((god, index) => {
//                 return (
//                     <div className="check-box_wrapper">
//                     <input name={god.name} type="checkbox" />
//                     <div className="god-face" style={{marginLeft: "10px"}}>
//                       <div style={{ height: "30px", width: "30px", borderRadius: "3px" }}>
//                         <img
//                           src={god.url}
//                           alt={god.name}
//                           style={{
//                             height: "48px",
//                             width: "48px",
//                             transform: "scale(0.625)",
//                             transformOrigin: "0px 0px 0px",
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <strong className="god-name">{god.name}</strong>
//                   </div>
//                 )
//             })}
//             </form>
//             </div>
//             </InfiniteScroll>
//         )
//     }
// }

// export default function DragDropGodList(props) {
//     const [allgods, setallgods] = useState([]);
//     const [
//         god,
//         setGod,
//       ] = useContext(PlayerContext);
//     useEffect(() => {
//         fetch("/api/gods").then((res) =>
//         res.json().then((data) => {
//             Object.keys(data).forEach((key) => {
//                 setallgods((allgods) => [
//                     ...allgods,
//                     {
//                         name: data[key].name,
//                         url: data[key].url,
//                     }
//                 ])
//             })
//         }))
//     }, []);
//     return (
//         <div className="content-section">
//             <div className="content-section_header">God List</div>
//             <GodsDisplay gods={allgods} setGod={setGod}/>
//         </div>
//     )
// }

import React, { useState, useEffect, useContext } from "react";
import Picture from "./Picture";
import { useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import "../Component.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { DamageContext } from "./DamageContext";

function DragDropGodList(props) {
  const [drop, allgods, board, setBoard, god, setGod, build, setBuild] =
    useContext(DamageContext);
  return (
    <div className="content-section">
      <div className="content-section_header">God List</div>
      <InfiniteScroll dataLength={1} height={"550px"}>
        <div className="gods-container">
          {allgods.map((god) => {

            return <Picture url={god.url} id={god.id} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export function DragDropItemList(props) {
  console.log(props)
  // const [drop, allgods, board, setBoard, god, setGod] = useContext(DamageContext);
  return (
    <div className="content-section">
      <div className="content-section_header">Item List</div>
      <InfiniteScroll dataLength={1} height={"550px"}>
        <div className="gods-container">
          {props.items.map((item) => {
            let url = `https://webcdn.hirezstudios.com/smite/item-icons/${item.id
              .replaceAll("'", "")
              .replaceAll(" ", "-")
              .toLowerCase()}.jpg`;
            return <Picture url={url} id={item.id} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
export default DragDropGodList;
