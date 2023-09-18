import { defineConfig } from "vite";
import path from "path";

const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "EGAK",
      formats: ["es", "umd"],
      fileName: (format) => `naras${format === "umd" ? ".min" : ""}.js`,
    },
    minify: false,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
