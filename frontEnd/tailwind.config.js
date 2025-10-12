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
  daisyui: {
    themes: [
      // Built-in themes
      "light",
      "dark",
      "cupcake",
      "cyberpunk",
      "dracula",
      // Custom themes as separate objects
      {
        devtinder: {
          primary: "#38bdf8",
          secondary: "#818cf8",
          accent: "#34d399",
          neutral: "#1e293b",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f1f5f9",
          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      {
        devtinderlight: {
          primary: "#0ea5e9",
          secondary: "#6366f1",
          accent: "#10b981",
          neutral: "#f3f4f6",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#111827",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
