import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Add this server configuration
  server: {
    proxy: {
      // Proxy all requests starting with /api to your backend server
      "/api": {
        target: "http://localhost:7777",
        changeOrigin: true, // Recommended for CORS
      },
    },
  },
});
