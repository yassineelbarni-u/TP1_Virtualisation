import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Important pour Docker
    port: 5173,
    proxy: {
      "/api": {
        target: "http://server:5001", // On utilise le nom du service Docker
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

