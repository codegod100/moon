import { metadata } from "../store/atproto.ts";
export const prerender = false;
export async function GET({ params, request }) {
  return new Response(JSON.stringify(await metadata()), {
    headers: { "Content-Type": "application/json" },
  });
}
