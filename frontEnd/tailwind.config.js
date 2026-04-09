import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", ...defaultTheme.fontFamily.sans],
        display: ["Sora", ...defaultTheme.fontFamily.sans],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        devtinderlux: {
          primary: "#d76480",
          secondary: "#ff9f6e",
          accent: "#8e74ff",
          neutral: "#362837",
          "base-100": "#fffaf7",
          "base-200": "#fff3ee",
          "base-300": "#f7e4dc",
          "base-content": "#2d2130",
          info: "#4f7cff",
          success: "#28b784",
          warning: "#f2a33b",
          error: "#ea5d6b",
        },
      },
      {
        devtindernight: {
          primary: "#ff8cab",
          secondary: "#ffb181",
          accent: "#a28cff",
          neutral: "#18121d",
          "base-100": "#15111a",
          "base-200": "#201923",
          "base-300": "#2b2231",
          "base-content": "#fff4f5",
          info: "#7ca8ff",
          success: "#3fcb98",
          warning: "#f4ba5f",
          error: "#ff7a88",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
