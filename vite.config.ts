import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		// 1. Resolve paths first
		tsConfigPaths(),

		// 2. Process MDX files BEFORE TanStack Start processes the JS
		{
			enforce: "pre",
			...mdx({
				mdExtensions: [".md", ".mdx"],
				remarkPlugins: [
					remarkFrontmatter,
					[remarkMdxFrontmatter, { name: "frontmatter" }],
					remarkGfm,
				],
				providerImportSource: "@mdx-js/react",
			}),
		},

		// 3. Main TanStack Start plugin (This includes Vite-React internally)
		tanstackStart(),

		// 4. Styles
		tailwindcss(),

		// 5. Build optimizations
		viteCompression({
			algorithm: "gzip",
			ext: ".gz",
		}),
		viteCompression({
			algorithm: "brotliCompress",
			ext: ".br",
		}),
	],
});
