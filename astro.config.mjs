import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel/serverless';


export default defineConfig({
  integrations: [react(), icon(), tailwind()],
  output: 'server', 
  adapter: vercel(),
});
