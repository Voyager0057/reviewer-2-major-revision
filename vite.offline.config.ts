import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, "offline"),
  base: "./",
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: resolve(projectRoot, ".offline-build"),
    emptyOutDir: true,
    target: "es2020",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: Number.POSITIVE_INFINITY,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
