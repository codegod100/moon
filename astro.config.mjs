// @ts-check
import { defineConfig } from "astro/config";
import deno from "@deno/astro-adapter";
import preact from "@astrojs/preact";
import elm from "astro-integration-elm";

import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind(), mdx(), elm(), svelte()],
  adapter: deno(),
});