import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Keep authored Markdown manuscripts in an explicit Astro collection.
// Public article routes currently render the approved Markdown source directly;
// this collection declaration makes the content inventory explicit and avoids
// Astro's deprecated implicit collection generation.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
});

export const collections = { articles };
