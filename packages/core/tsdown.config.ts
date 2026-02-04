import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/schema/index.ts", "src/react/index.ts"],
  format: ["esm"],
  outDir: "dist",
  dts: true,
  clean: true,
});
