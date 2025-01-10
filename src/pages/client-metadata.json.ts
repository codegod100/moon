import { metadata } from "../store/atproto.ts";
export const prerender = false;
export async function GET() {
  return new Response(JSON.stringify(metadata), {
    headers: { "Content-Type": "application/json" },
  });
}
