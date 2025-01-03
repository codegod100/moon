// @ts-check
import { defineConfig } from "astro/config";
import deno from "@deno/astro-adapter";
import preact from "@astrojs/preact";

import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact({
      include: ["**/preact/*"],
    }),
    tailwind(),
    mdx(),
    svelte(),
    react({
      include: ["**/react/*"],
    }),
  ],
  adapter: deno(),
});
