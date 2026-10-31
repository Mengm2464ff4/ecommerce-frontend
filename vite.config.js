// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     open: true,
//     headers: {
//       "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
//       "Cross-Origin-Embedder-Policy": "unsafe-none",
//       'Referrer-Policy': 'strict-origin-when-cross-origin',
//     },
//     proxy: {
//       // Optional: proxy /api requests to backend to avoid CORS
//       // '/api': {
//       //   target: 'http://localhost:8080',
//       //   changeOrigin: true,
//       // },
//     },
//   },
//   build: {
//     outDir: "dist",
//     sourcemap: false,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // We removed the strict headers that were blocking the scripts
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});