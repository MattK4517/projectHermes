import { Link } from "react-router-dom"
import TeamDisplay from "./TeamDisplay";
import HeaderMatchInfoSUmmary from "./HeaderMatchInfoSummary";

const reducer = (accumulator, currentValue) => accumulator + currentValue;

// export default function BaseMatchSummary(props) {
//     return (
//       <div className="match-summary-container" style={{ minWidth: "200px" }}>
//         <div className="match-info-header">
//           <h3>
//             Ranked Conquest - {props.matchId}
//           </h3>
//           <div style={{display: "flex", justifyContent: "center"}}>{props.length} Minutes - {props.date}</div>
//         </div>
//         <div className="basic-match-info">
//             <div className="basic-info-bans">
//             <div>Winning Side Bans</div>
//               <div className="bans-container">
//                 {props.bansWinner.map((ban) => {
//                   if (ban) {
//                     return (
//                       <Link to={"/".concat(ban.replaceAll(" ", "_"))}>
//                         <div style={{ position: "relative" }}>
//                           <div className="god-icon">
//                             <div style={{ height: "30px", width: "30px" }}>
//                               <img
//                                 src={`https://webcdn.hirezstudios.com/smite/god-icons/${ban
//                                   .replaceAll(" ", "-")
//                                   .toLowerCase()}.jpg`}
//                                 alt={ban}
//                                 style={{
//                                   height: "48px",
//                                   width: "48px",
//                                   transform: "scale(0.625)",
//                                   transformOrigin: "0px 0px 0px",
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     );
//                   }
//                 })}
//               </div>
//               <div>Loser Side Bans</div>
//               <div className="bans-container">
//                 {props.bansLoser.map((ban) => {
//                   if (ban) {
//                     return (
//                       <Link to={"/".concat(ban.replaceAll(" ", "_"))}>
//                         <div style={{ position: "relative" }}>
//                           <div className="god-icon">
//                             <div style={{ height: "30px", width: "30px" }}>
//                               <img
//                                 src={`https://webcdn.hirezstudios.com/smite/god-icons/${ban
//                                   .replaceAll(" ", "-")
//                                   .toLowerCase()}.jpg`}
//                                 alt={ban}
//                                 style={{
//                                   height: "48px",
//                                   width: "48px",
//                                   transform: "scale(0.625)",
//                                   transformOrigin: "0px 0px 0px",
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     );
//                   }
//                 })}
//               </div>
//             </div>
//             <PlayerInfoSummary godsWinner={props.godsWinner} godsLoser={props.godsLoser}/>
//             <div className="basic-info-mmrs">
//               <div>Winning Side MMR</div>
//               <div>{(props.mmrWinner.reduce(reducer) / 5).toFixed(2)}</div>
//               <div>Losing Side MMR</div>
//               <div>{(props.mmrLoser.reduce(reducer) / 5).toFixed(2)}</div>
//             </div>
//         </div>
//       </div>
//     );
//   }

export default function BaseMatchSummary(props) {
    return(
        <div className="match-summary-container" style={{ minWidth: "200px" }}>
        <div className="match-info-header">
          <h3>
            {props.queueType} Conquest - {props.matchId}
          </h3>
          <div style={{display: "flex", justifyContent: "center"}}>{props.length} Minutes - {props.date}</div>
        </div>
        <div className="match-info-simple">
            <TeamDisplay bans={props.bansWinner} gods={props.godsWinner} mmr={props.mmrWinner} team={"Winner"}/>
            <HeaderMatchInfoSUmmary matchData={props.matchData}/>
            <TeamDisplay bans={props.bansLoser} gods={props.godsLoser} mmr={props.mmrLoser} team={"Loser"}/>
        </div>
      </div>

    )
}