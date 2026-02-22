// Plugins
import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Fonts from "unplugin-fonts/vite";
import Components from "unplugin-vue-components/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import VueRouter from "unplugin-vue-router/vite";
import Layouts from "vite-plugin-vue-layouts-next";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        Layouts(),
        Vue({
            template: { transformAssetUrls },
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: "src/styles/settings.scss",
            },
        }),
        tailwindcss(),
        Components(),
        Fonts(),
        AutoImport({
            imports: [
                "vue",
                VueRouterAutoImports,
                {
                    pinia: ["defineStore", "storeToRefs"],
                },
            ],
            dirs: ["src/composables/utils"],
            dts: "src/auto-imports.d.ts",
            eslintrc: {
                enabled: true,
                filepath: "./.eslintrc-auto-import.json",
                globalsPropValue: true,
            },
            vueTemplate: true,
        }),
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
        host: "0.0.0.0",
        port: 3000,
        allowedHosts: ["regulacao.test", "frontend"],
        hmr: {
            host: "regulacao.test",
            protocol: "ws",
            port: 3000,
        },
    },

    css: {
        preprocessorOptions: {
            sass: {
                api: "modern-compiler",
            },
            scss: {
                api: "modern-compiler",
            },
        },
    },
});
