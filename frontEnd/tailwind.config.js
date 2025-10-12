// frontEnd/tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("daisyui")],
  // We are adding the new 'devtinderlight' theme here
  daisyui: {
    themes: [
      {
        devtinder: {
          // Your existing dark theme
          primary: "#38bdf8",
          secondary: "#818cf8",
          accent: "#34d399",
          neutral: "#1e293b",
          "base-100": "#0f172a",
          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        devtinderlight: {
          // The new light theme
          primary: "#0ea5e9",
          secondary: "#6366f1",
          accent: "#10b981",
          neutral: "#1f2937",
          "base-100": "#f3f4f6", // Light grey background
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};
