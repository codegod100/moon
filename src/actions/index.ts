import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db, User, eq, Post } from "astro:db";
import {
  configureOAuth,
  OAuthUserAgent,
  createAuthorizationUrl,
  getSession,
  resolveFromIdentity,
} from "@atcute/oauth-browser-client";
import { metadata } from "../store/atproto";
import "@std/dotenv/load";
import { XRPC } from "@atcute/client";
async function getAgent() {
  configureOAuth({ metadata });
  const { identity } = await resolveFromIdentity(localStorage["handle"]);
  const session = await getSession(identity.id, {
    allowStale: true,
  });
  const agent = new OAuthUserAgent(session);
  return agent;
}

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

export const server = {
  getCards: defineAction({
    handler: async () => {
      const agent = await getAgent();
      const rpc = new XRPC({ handler: agent });
      const { identity } = await resolveFromIdentity(localStorage["handle"]);
      const session = await getSession(identity.id, {
        allowStale: true,
      });
      const resp = (await rpc.get("com.atproto.repo.listRecords", {
        params: {
          repo: session.info.sub,
          collection: "nandi.schemas.card",
        },
      })) as { data: { records: CardRecord[] } };

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
    },
  }),
  getAgent: defineAction({
    handler: async () => {
      configureOAuth({ metadata });
      const { identity } = await resolveFromIdentity(localStorage["handle"]);
      // console.log({ identity });
      const session = await getSession(identity.id, {
        allowStale: true,
      });
      // console.log({ session });
      const agent = new OAuthUserAgent(session);
      // console.log({ session, identity, agent });
      return agent;
    },
  }),
  storeLocal: defineAction({
    input: z.object({ key: z.string(), value: z.string() }),
    handler: async (input) => {
      localStorage[input.key] = input.value;
      console.log({ localStorage });
      return JSON.stringify({ success: true });
    },
  }),
  insertUser: defineAction({
    input: z.object({ username: z.string() }),
    handler: async (input) => {
      const resp = await db.insert(User).values({ username: input.username });
      console.log({ resp });
      return JSON.stringify(resp);
    },
  }),
  getUsers: defineAction({
    handler: async () => {
      const users = await db.select().from(User).all();
      return users;
    },
  }),
  deleteUser: defineAction({
    input: z.object({ id: z.number() }),
    handler: async (input) => {
      console.log("delete");
      const resp = await db.delete(User).where(eq(User.id, input.id));
      return JSON.stringify(resp);
    },
  }),
  createPost: defineAction({
    input: z.object({ title: z.string(), content: z.string() }),
    handler: async (input) => {
      const resp = await db
        .insert(Post)
        .values({ title: input.title, content: input.content });
      return JSON.stringify(resp);
    },
  }),
  getPosts: defineAction({
    handler: async () => {
      const posts = await db.select().from(Post).all();
      return posts;
    },
  }),
  deletePost: defineAction({
    input: z.object({ id: z.number() }),
    handler: async (input) => {
      const resp = await db.delete(Post).where(eq(Post.id, input.id));
      return JSON.stringify(resp);
    },
  }),
};
