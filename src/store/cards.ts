import {
configureOAuth,
  getSession,
  OAuthUserAgent,
  resolveFromIdentity,
} from "@atcute/oauth-browser-client";
import { XRPC } from "@atcute/client";
import * as TID from "@atcute/tid";
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

export async function getCards(metadata): Promise<Card[]> {
  configureOAuth({ metadata });
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

async function UrlPreview(url: string) {
  const resp = await fetch(
    `https://cardyb.bsky.app/v1/extract?url=${url}`,
  ).then((r) => r.json());
  return resp;
}

async function parseText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  const previews = [];
  for (const part of parts) {
    if (part.match(/^https?:\/\//)) {
      previews.push(await UrlPreview(part));
    }
  }
  return previews;
}

export async function post(text: string) {
  const { identity } = await resolveFromIdentity(localStorage["handle"]);
  const session = await getSession(identity.id, {
    allowStale: true,
  });
  const agent = new OAuthUserAgent(session);
  const rpc = new XRPC({ handler: agent });

  let imageRecord = null;
  if (image.get() && image.get().size !== 0) {
    const resp = await rpc.call("com.atproto.repo.uploadBlob", {
      data: image.get(),
    });
    console.log({ resp });
    // const link = resp.data.blob.ref.$link;

    imageRecord = {
      $type: "blob",
      ref: {
        $link: resp.data.blob.ref.$link,
      },
      mimeType: resp.data.blob.mimeType,
      size: image.get().size,
    };
  }
  const links = await parseText(text);

  const put = await rpc.call("com.atproto.repo.putRecord", {
    data: {
      repo: session.info.sub,
      collection: "nandi.schemas.card",
      rkey: TID.now(),
      record: {
        $type: "nandi.schemas.card",
        text,
        image: imageRecord,
        links,
      },
      validate: false,
    },
  });
}

export const cards = atom<Card[]>([]);
export const image = atom<File | null>(null);
onMount(cards, () => {
  task(async () => {
    cards.set(await getCards());
  });
});
