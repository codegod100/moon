import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db, User, eq } from "astro:db";
import "@std/dotenv/load";
export const server = {
  insertUser: defineAction({
    username: z.string(),
    handler: async (username: string) => {
      const resp = await db.insert(User).values({ username });
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
    id: z.number(),
    handler: async (id: number) => {
      console.log("delete");
      const resp = await db.delete(User).where(eq(User.id, id));
      return JSON.stringify(resp);
    },
  }),
};
