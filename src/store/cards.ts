import {
  getSession,
  OAuthUserAgent,
  resolveFromIdentity,
} from "@atcute/oauth-browser-client";
import { XRPC } from "@atcute/client";

import { z } from "zod";
import { atom, computed, onMount, task } from "nanostores";
export const AtProtoImage = z.object({
  type: z.string(),
  link: z.string(),
  did: z.string(),
});
export type AtProtoImage = z.infer<typeof AtProtoImage>;

const Link = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
});
export const Card = z.object({
  text: z.string(),
  uri: z.string().default(""),
  created: z.number().default(Date.now()),
  image: AtProtoImage.optional(),
  links: z.array(Link).optional(),
});
export type Card = z.infer<typeof Card>;

async function getCards(): Promise<Card[]> {
  const { identity } = await resolveFromIdentity(localStorage["handle"]);
  const session = await getSession(identity.id, {
    allowStale: true,
  });
  const agent = new OAuthUserAgent(session);
  const rpc = new XRPC({ handler: agent });

  const resp = (await rpc.get("com.atproto.repo.listRecords", {
    params: {
      repo: session.info.sub,
      collection: "nandi.schemas.card",
    },
  })) as { data: { records: CardRecord[] } };
  interface CardRecord {
    uri: string;
    value: {
      text: string;
      links: [];
      image?: {
        mimeType: string;
        ref: {
          $link: string;
        };
      };
    };
  }
  const cards = resp.data.records.map((record: CardRecord) => {
    let image;
    if (record.value.image) {
      image = {
        type: record.value.image.mimeType,
        link: record.value.image.ref.$link,
        did: identity.id,
      };
    }
    return {
      image,
      uri: record.uri,
      text: record.value.text,
      links: record.value.links,
      created: Date.now(), // Add required created field
    };
  });

  return cards;
}
export const cards = atom<Card[]>([]);

onMount(cards, () => {
  task(async () => {
    cards.set(await getCards());
  });
});
