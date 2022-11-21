/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      card: '#17172e',
      darkBlue: "#070720",
      fontAlt: '#babddb',
      mainBackGroundColor: "#070720",
      borderColor: '#414165',
      lightBlue: '#cddcfe',
      darkRed: "#ff4e50",
      lightRed: "#fcb1b2",
      lightPurple: "#e2ccff",
      mediumPurple: "#bf94e4",
      darkPurple: "#a966ff",
    },
    extend: {
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(150px, 1fr))",
      }
    },
  },
  plugins: [],
};
