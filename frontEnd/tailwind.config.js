// frontEnd/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 'sans' will be the default body font
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        // 'mono' can be used for headings or code-like text
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        devtinder: {
          primary: "#38bdf8", // A bright, clear blue for primary actions
          secondary: "#818cf8", // A soft purple for secondary actions
          accent: "#34d399", // A vibrant green for accents and success states
          neutral: "#1e293b", // A dark slate for text
          "base-100": "#0f172a", // The main dark background, like a code editor
          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};
