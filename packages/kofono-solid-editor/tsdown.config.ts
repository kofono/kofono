import { defineConfig } from "tsdown";
import solid from "unplugin-solid/rolldown";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.tsx"],
    minify: true,
    outDir: "dist/",
    platform: "neutral",
    plugins: [solid()],
});
