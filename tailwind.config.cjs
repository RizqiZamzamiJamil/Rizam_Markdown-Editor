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
          bg: "#05070d",
          panel: "#0a0f1b",
          panelSoft: "rgba(13, 19, 32, 0.82)",
          panelStrong: "#111827",
          cyan: "#13d8ff",
          blue: "#0b8fff",
          green: "#12b981",
          amber: "#f59e0b",
          muted: "#94a3b8",
          line: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Space Grotesk", "Plus Jakarta Sans", "sans-serif"],
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
        cyan: "0 18px 55px rgba(19, 216, 255, 0.16)",
      },
    },
  },
  plugins: [typography, flowbite],
};
