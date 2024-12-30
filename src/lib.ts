export function createSlug(input: string): string {
    return input
        .toLowerCase()               // Convert to lowercase
        .trim()                      // Remove leading/trailing whitespace
        .replace(/[^\w\s-]/g, '')    // Remove non-word chars (except spaces and hyphens)
        .replace(/[\s_-]+/g, '-')    // Replace spaces, underscores, multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}