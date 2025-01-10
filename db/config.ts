import { defineDb, defineTable, column } from "astro:db";
const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),

    username: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { User },
});
