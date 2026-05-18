import { defineConfig } from "tsdown";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    minify: true,
    outDir: "dist",
    platform: "neutral",
    deps: {
        onlyBundle: false,
    },
});
