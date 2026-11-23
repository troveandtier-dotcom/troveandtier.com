import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://troveandtier.com',
  build: { format: 'directory' },
});
