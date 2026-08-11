import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  publicDir: "static",
  ssr: {
    noExternal: ["react-helmet-async"]
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src")
    }
  },
  build: {
    sourcemap: "hidden",
    modulePreload: false,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173
  }
});
