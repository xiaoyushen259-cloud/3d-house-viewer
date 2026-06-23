import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  build: {
    assetsDir: "assets",
    chunkSizeWarningLimit: 1200,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          maps: ["@amap/amap-jsapi-loader"],
          panorama: ["three", "three/examples/jsm/controls/OrbitControls.js"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  plugins: [react()],
});
