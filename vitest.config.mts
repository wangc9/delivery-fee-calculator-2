import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./setupTest.ts",
    exclude: [...configDefaults.exclude, "src/e2eTests/*"],
    environmentOptions: {
      url: "http://localhost/", // sets the base URL for resolving relative URLs
    },
  },
});
