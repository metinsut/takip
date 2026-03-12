import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 8090,
    open: true,
  },
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "baseLocale", "preferredLanguage"],
    }),
    devtools(),
    nitro({
      preset: "bun",
    }),
    tailwindcss(),
    tanstackStart(),
    babel({ babelConfig: { plugins: ["babel-plugin-react-compiler"] } }),
  ],
});

export default config;
