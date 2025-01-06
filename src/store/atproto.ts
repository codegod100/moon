import { PUBLIC_URL } from "astro:env/client";
const publicUrl = PUBLIC_URL;
const url = publicUrl || `http://127.0.0.1:4321`;
const enc = encodeURIComponent;

export let CLIENT_ID: string;
export let REDIRECT_URI: string;
export type Metadata = {
  client_name: string;
  client_id: string;
  client_uri: string;
  redirect_uri: string;
  redirect_uris: [string, ...string[]];
  scope: string;
  grant_types: ["authorization_code", "refresh_token"];
  response_types: ["code"];
  application_type: "web";
  token_endpoint_auth_method: "none";
  dpop_bound_access_tokens: boolean;
};
export const metadata: Metadata = {
  client_name: "nandi oauth",
  client_id: publicUrl
    ? `${url}/client-metadata.json`
    : `http://localhost?redirect_uri=${enc(`${url}/callback`)}&scope=${enc(
        "atproto transition:generic"
      )}`,

  client_uri: url,
  redirect_uri: `${url}/callback`,
  redirect_uris: [`${url}/callback`],
  scope: "atproto transition:generic",
  grant_types: ["authorization_code", "refresh_token"],
  response_types: ["code"],
  application_type: "web",
  token_endpoint_auth_method: "none",
  dpop_bound_access_tokens: true,
};
