import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://statecharts.sh",
  output: "static",
  integrations: [
    starlight({
      title: "Statecharts.sh Docs",
      components: {
        SiteTitle: "./src/components/starlight/SiteTitle.astro",
      },
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/sannajammeh/statecharts",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "docs" },
            { label: "Quick Start", slug: "docs/getting-started" },
          ],
        },
        {
          label: "React",
          items: [
            { label: "Quick Start", slug: "docs/react" },
            { label: "Hook API", slug: "docs/react/hook-api" },
            { label: "Patterns", slug: "docs/react/patterns" },
          ],
        },
        {
          label: "API Reference",
          autogenerate: { directory: "docs/api" },
        },
        {
          label: "Examples",
          autogenerate: { directory: "docs/examples" },
        },
      ],
      customCss: ["./src/styles/starlight.css"],
    }),
    react(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
