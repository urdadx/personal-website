import type { ComponentType } from "react";

export interface BlogFrontmatter {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

export type BlogContentComponent = ComponentType<Record<string, unknown>>;

type BlogModule = {
  default: BlogContentComponent;
  frontmatter?: Partial<Omit<BlogFrontmatter, "slug">>;
};

const componentModules = import.meta.glob("../content/blog/*.{md,mdx}", {
  eager: true,
}) as Record<string, BlogModule>;

type BlogEntry = {
  slug: string;
  component: BlogContentComponent;
  frontmatter: BlogFrontmatter;
};

const entries: BlogEntry[] = Object.entries(componentModules).flatMap(([filePath, module]) => {
  const slug = filePath
    .split("/")
    .pop()
    ?.replace(/\.(mdx|md)$/i, "");

  if (!slug || !module?.default) {
    return [];
  }

  const data = module.frontmatter ?? {};

  const normalizedDate = data.date ? new Date(data.date).toISOString() : "";

  const frontmatter: BlogFrontmatter = {
    slug,
    title: data.title ?? slug.replace(/-/g, " "),
    description: data.description ?? "",
    date: normalizedDate,
    readingTime: data.readingTime ?? "5 min",
  };

  return [
    {
      slug,
      component: module.default,
      frontmatter,
    },
  ];
});

entries.sort(
  (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
);

export const blogFrontmatterList = entries.map((entry) => entry.frontmatter);

export const blogFrontmatterBySlug = Object.fromEntries(
  entries.map((entry) => [entry.slug, entry.frontmatter]),
);

export const blogComponentsBySlug = Object.fromEntries(
  entries.map((entry) => [entry.slug, entry.component]),
);
