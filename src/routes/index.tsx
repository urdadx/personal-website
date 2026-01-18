import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GitHubActivitySection } from "@/components/sections/github-activity-section";
import { Header } from "@/components/sections/header";
import { ProjectsSection } from "@/components/sections/projects-section";
import { WritingSection } from "@/components/sections/writing-section";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import type { ContributionCalendar } from "@/lib/github";
import { getGitHubContributionCalendar, getGitHubRepoInfo } from "@/lib/github-api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const [githubData, githubCalendar] = await Promise.all([
      getGitHubRepoInfo(),
      getGitHubContributionCalendar(),
    ]);

    return { githubData, githubCalendar };
  },
  head: () => ({
    meta: [
      {
        title: "Abdul Wahab Abass - Product Engineer & Software Developer",
      },
      {
        name: "description",
        content:
          "Product engineer focused on thoughtful digital experiences. Building applications for study, focus, and personal growth. View my portfolio and latest projects.",
      },
      {
        name: "keywords",
        content:
          "Abdul Wahab, software engineer, product engineer, full-stack developer, React, TypeScript, portfolio",
      },
      {
        property: "og:title",
        content: "Abdul Wahab - Product Engineer & Software Developer",
      },
      {
        property: "og:description",
        content:
          "Product engineer focused on thoughtful digital experiences. Building applications for study, focus, and personal growth.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://urdadx.com",
      },
      {
        property: "og:site_name",
        content: "Abdul Wahab Portfolio",
      },
      {
        property: "og:image",
        content: "https://urdadx.com/og-image.png",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        property: "og:image:alt",
        content: "Abdul Wahab - Product Engineer & Software Developer",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:image",
        content: "https://urdadx.com/og-image.png",
      },
      {
        name: "twitter:title",
        content: "Abdul Wahab - Product Engineer & Software Developer",
      },
      {
        name: "twitter:description",
        content:
          "Product engineer focused on thoughtful digital experiences. Building applications for study, focus, and personal growth.",
      },
      {
        name: "author",
        content: "Abdul Wahab",
      },
      {
        name: "robots",
        content: "index, follow",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://urdadx.com",
      },
      {
        rel: "preload",
        as: "image",
        href: "/images/optimized/photo-JtrwPxnjdA37BdPP-640.webp",
        type: "image/webp",
        fetchPriority: "high",
      },
    ],
  }),
});

function Home() {
  const { githubData, githubCalendar } = Route.useLoaderData();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abdul Wahab",
    jobTitle: "Software Engineer",
    description:
      "Software engineer focused on thoughtful digital experiences. Building tools for study, focus, and personal growth.",
    url: "https://urdadx.com",
    sameAs: ["https://github.com/urdadx", "https://www.linkedin.com/", "https://x.com/Urdadx"],
    email: "urdadx@gmail.com",
    worksFor: {
      "@type": "Organization",
      name: "Redi.Health",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <Header />
        <ProjectsSection projects={projects} githubData={githubData} />
        <GitHubActivitySection githubCalendar={githubCalendar as ContributionCalendar | null} />
        <ExperienceSection experience={experience} />
        <ContactSection />
        <WritingSection />

        <footer className="pt-8 border-t border-border/20">
          <p className="text-sm text-muted-foreground font-mono">
            © {new Date().getFullYear()} Abdul Wahab
          </p>
        </footer>
      </main>
    </div>
  );
}
