import { defineDb, defineTable, column } from "astro:db";
const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text(),
  },
});

const Post = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    content: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { User, Post },
});
