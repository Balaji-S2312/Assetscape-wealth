import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const API_URL =
  process.env.VITE_API_URL ||
  "https://assetscape-backend.onrender.com/api";

export default defineConfig({
  define: {
    // Force-inject into both client and SSR bundles so import.meta.env.VITE_API_URL
    // always resolves to the production backend URL at build time.
    "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : "node-server"),
  },
});
