import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/dictionary-api": {
        target: "https://api.dictionaryapi.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dictionary-api/, ""),
      },
      "/datamuse-api": {
        target: "https://api.datamuse.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/datamuse-api/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
