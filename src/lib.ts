// import { neon } from "@neondatabase/serverless";

export function createSlug(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// export const sql = neon(import.meta.env.NEON_DATABASE_URL);

export function userDivs(newusers: { username: string; id: number }[]) {
  return `
           ${newusers
             .map((user) => {
               return `<div>${user.username} wat <button data-id="${user.id}">Delete</button></div>`;
             })
             .join("")}
        `;
}
