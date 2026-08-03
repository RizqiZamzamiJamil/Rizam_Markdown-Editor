const flowbite = require("flowbite/plugin");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#000000",
          panel: "#10151d",
          panelSoft: "#151b25",
          panelStrong: "#19212d",
          cyan: "#16d8f2",
          blue: "#027dfd",
          green: "#059669",
          amber: "#f59e0b",
          muted: "#94a3b8",
          line: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: [
          "Poppins",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Poppins", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        panel: "0 24px 70px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [typography, flowbite],
};
