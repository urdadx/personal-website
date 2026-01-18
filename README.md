# Abdul Wahab Website

A modern personal website built with TanStack Start (full-stack React), Shadcn/ui, Tailwind CSS v4, and TypeScript.

## Features

- File-based routing via TanStack Start with co-located loaders and server functions
- Shadcn/ui component library styled through Tailwind CSS v4 and OKLCH design tokens
- Markdown-powered blog posts sourced from `src/content`
- GitHub activity section with optional API integration

## Quick Start

1. Ensure Node.js 18+ and pnpm are installed.
2. Install dependencies:
      ```bash
      pnpm install
      ```
3. Launch the dev server at http://localhost:3000 with hot reload and SSR:
      ```bash
      pnpm run dev
      ```

## Environment Variables

Set these in a `.env` file or your shell before running the app:

- `GITHUB_TOKEN` (server) or `VITE_GITHUB_TOKEN` (client fallback): enables GitHub REST + GraphQL requests for repo metadata and contribution heatmaps. Omit to use the built-in fallback data.

An `.env.example` file is included with sane defaults. To rotate the password hash, run:

## Project Structure

- `src/routes` — TanStack Start route files; each exports `createFileRoute`
- `src/components` — UI building blocks and feature composites (`ui/` holds Shadcn primitives)
- `src/content` — Markdown posts with frontmatter consumed by blog routes
- `src/lib` — Utilities such as GitHub fetch helpers and Tailwind class utilities
- `src/styles/app.css` — Tailwind setup, design tokens, and global styles
- `src/routeTree.gen.ts` — auto-generated route manifest (do not edit)

## Deployment

For instructions on how to deploy using docker. see

For instructions on how to deploy using Docker, see [DEPLOYMENT.md](./DEPLOYMENT.md).
# personal-website
# personal-website
