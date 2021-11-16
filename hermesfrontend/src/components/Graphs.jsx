// import React from "react";
// import { useState, useEffect } from "react";

// import {
//   ScatterChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Scatter
// } from "recharts";

// // const data = [
// //   { index: 10000, red: 1643, blue: 790 },
// //   { index: 1666, red: 182, blue: 42 },
// //   { index: 625, red: 56, blue: 11 },
// //   // Calculation of line of best fit is not included in this demo
// //   { index: 300, redLine: 0 },
// //   { index: 10000, redLine: 1522 },
// //   { index: 600, blueLine: 0 },
// //   { index: 10000, blueLine: 678 }
// // ];

// export default function Graph() {
//     const [graphData, setData] = useState([]);
//     useEffect(() => {
//         fetch("/graph").then((res) =>
//           res.json().then((data) => {
//             Object.keys(data).forEach((index, i) => {
//                 console.log(i)
//                 if (i <= 500) {
//                     setData((graphData) => [
//                         ...graphData,
//                         {
//                         kills: data[index].kills,
//                         role: data[index].role,
//                         },
//                     ]);
//                 }
//             })
//           })
//         );
//       }, []);
//     //   console.log(graphData)
//   return (
//     <ScatterChart width={730} height={250}
//     margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="index" name="game" unit="games" />
//     <YAxis dataKey="kills" name="kills" unit="kills" />
//     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//     <Legend />
//     <Scatter name="A school" data={graphData} fill="#8884d8" />
//     </ScatterChart>
//   );
// }

export default function Graph() {
  return(
    <p>hi</p>
  )
}