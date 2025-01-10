// @ts-check
import { defineConfig, envField } from "astro/config";
import deno from "@deno/astro-adapter";
import preact from "@astrojs/preact";

import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      PUBLIC_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  integrations: [preact({
    include: ["**/preact/*"],
  }), tailwind(), mdx(), svelte(), react({
    include: ["**/react/*"],
  }), db()],
  adapter: deno(),
});