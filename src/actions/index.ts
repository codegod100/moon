import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db, User, eq, Post } from "astro:db";
import "@std/dotenv/load";
export const server = {
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
