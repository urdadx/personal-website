import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 3000,
	},
	build: {
		outDir: ".output",
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		assetsInlineLimit: 4096,
	},
	plugins: [
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
		tsConfigPaths(),
		tanstackStart(),
		nitro(),
		viteReact({
			include: /\.(mdx|md|jsx|js|tsx|ts)$/,
		}),
		tailwindcss(),
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
