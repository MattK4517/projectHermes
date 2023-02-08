/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      card: "#17172e",
      darkBlue: "#070720",
      fontAlt: "#babddb",
      mainBackGroundColor: "#070720",
      darkBackGroundColor: "#11112a",
      borderColor: "#414165",
      lightBlue: "#cddcfe",
      lighterBlue: "#bbbedb",
      darkRed: "#ff4e50",
      lightRed: "#fcb1b2",
      lightPurple: "#e2ccff",
      mediumPurple: "#bf94e4",
      darkPurple: "#a966ff",
      winnerColor: "#3273fa"

    },
    extend: {
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(150px, 1fr))",
      },
      visibility: ["group-hover"],
    },
  },
  plugins: [],
};
