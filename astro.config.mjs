// @ts-check
import { defineConfig } from "astro/config";
import deno from "@deno/astro-adapter";
import preact from "@astrojs/preact";

import tailwind from "@astrojs/tailwind";


import mdx from "@astrojs/mdx";


// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind(), mdx()],
  adapter: deno(),
});