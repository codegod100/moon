// @ts-check
import { defineConfig } from "astro/config";
import deno from "@deno/astro-adapter";
import preact from "@astrojs/preact";

import tailwind from "@astrojs/tailwind";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact(),
    tailwind(),
    // sentry(),
    // spotlightjs()
  ],
  adapter: deno(),
});
