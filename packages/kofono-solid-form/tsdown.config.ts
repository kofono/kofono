import { defineConfig } from "tsdown";
import solid from "unplugin-solid/rolldown";

export default defineConfig({
    clean: false,
    dts: true,
    entry: ["src/index.tsx"],
    root: "src",
    minify: true,
    outDir: "dist/",
    platform: "neutral",
    plugins: [solid()],
});
