import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    base: command === "build" ? "/docs/" : "/",
    plugins: [solidPlugin(), tailwindcss()],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
        ],
    },
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: true,
                advancedChunks: {
                    groups: [
                        { name: "solid", test: /node_modules\/solid-js/ },
                        { name: "tanstack", test: /node_modules\/@tanstack/ },
                        { name: "ace", test: /node_modules\/ace-builds/ },
                        { name: "vendor", test: /node_modules/ },
                    ],
                },
            },
        },
    },
}));
