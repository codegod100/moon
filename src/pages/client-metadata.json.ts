import { metadata } from "../store/atproto.ts";
export async function GET({ params, request }) {
  return new Response(JSON.stringify(metadata), {
    headers: { "Content-Type": "application/json" },
  });
}
