import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";

export const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "#06061f",
      color: "rgba(0, 0, 0, 0.87)",
      minWidth: "fit-content",
      border: "1px solid #3273fa",
      opacity: 100,
      minHeight: "fit-content"
    },
  }))(Tooltip);


export function CreateItemToolTip(props){
      if (props.index == 0) {
        props.item = props.item.item;
      } else if (props.index == 1) {
        props.item = props.item.item2;
      }
      return (
        <>
          <div
            style={{
              maxHeight: "350px",
              maxWidth: "750px",
              color: "#E6E6FA",
              alignItems: "left",
              fontSize: "14px",
            }}
          >
            <h5 style={{ width: "100%", fontSize: "1rem", color: "#1E90FF" }}>
              {props.item.item}
            </h5>
            <div>
              <p>{props.item.itemShortDesc}</p>
            </div>
            <div className="item-stats">
              <ul>
                {props.item.itemStats.map((stat) => {
                  return (
                    <li style={{ left: "0" }}>
                      {stat[0]}: {stat[1]}
                    </li>
                  );
                })}
              </ul>
              <div className="item-passive">
                <p>{props.item.itemPassive}</p>
              </div>
            </div>
            <p style={{ color: "#D4AF37" }}>
              <b>Price:</b> {props.item.itemAbsolutePrice}(
              {props.item.itemRelativePrice})
              <img
                style={{
                  maxHeight: "20px",
                  maxWidth: "20px",
                  paddingLeft: "3px",
                }}
                src="https://i.imgur.com/XofaIQ0.png"
                alt="gold-img"
              />
            </p>
          </div>
        </>
      );
  }
  



// <ResponsiveBuild
// className="build content-section scrolling-section"
// style={styling}
// >
// {items.map((item, index) => {
//   if (item === "None") {
//     return (
//       <>
//         <div className="content-section_header">Build</div>
//         <div className="empty-set">NO DATA TO DISPLAY</div>
//       </>
//     );
//   }
//   if (index === 0) {
//     return (
//       <div className="starter">
//         <div className="content-section_header">Starter</div>
//         <div>
//           <BuildStats stats={items} lower={0} upper={1} />
//         </div>
//       </div>
//     );
//   } else if (index === 1) {
//     return (
//       <div className="slot1">
//         <div className="content-section_header">
//           Second Slot Options
//         </div>
//         <div>
//           <BuildStats stats={items} lower={1} upper={2} />
//         </div>
//       </div>
//     );
//   } else if (index === 2) {
//     return (
//       <div className="slot2">
//         <div className="content-section_header">Third Slot Options</div>
//         <div>
//           <BuildStats stats={items} lower={2} upper={3} />
//         </div>
//       </div>
//     );
//   } else if (index === 3) {
//     return (
//       <div className="slot3">
//         <div className="content-section_header">
//           Fourth Slot Options
//         </div>
//         <div>
//           <BuildStats stats={items} lower={3} upper={4} />
//         </div>
//       </div>
//     );
//   } else if (index === 4) {
//     return (
//       <div className="slot4">
//         <div className="content-section_header">Fifth Slot Options</div>
//         <div>
//           <BuildStats stats={items} lower={4} upper={5} />
//         </div>
//       </div>
//     );
//   } else if (index === 5) {
//     return (
//       <div className="slot5">
//         <div className="content-section_header">Sixth Slot Options</div>
//         <div>
//           <BuildStats stats={items} lower={5} upper={6} />
//         </div>
//       </div>
//     );
//   }
// })}
// </ResponsiveBuild>