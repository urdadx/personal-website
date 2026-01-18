import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectsSectionProps {
  projects: Project[];
  githubData: Record<string, { lastUpdated: string }>;
}

export function ProjectsSection({ projects, githubData }: ProjectsSectionProps) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Crimson Pro, serif" }}>
        Selected Work
      </h2>
      <div className="space-y-4">
        {projects.map((project) => {
          const lastUpdated = project.repoKey
            ? githubData[project.repoKey]?.lastUpdated
            : undefined;
          const parsedLastUpdated = lastUpdated ? Date.parse(lastUpdated) : NaN;
          const displayYear = Number.isNaN(parsedLastUpdated)
            ? project.year
            : new Date(parsedLastUpdated).getFullYear().toString();

          return (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-start justify-between py-2 border-b border-border/20 hover:border-border/40 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-base font-medium"
                      style={{
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {project.title}
                    </span>
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p
                    className="text-sm text-muted-foreground mt-1"
                    style={{
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-muted-foreground font-mono">{displayYear}</span>
                  <span
                    className={`relative group/status inline-block size-1.5 rounded-full ${
                      project.status === "active" ? "bg-green-500" : "bg-muted-foreground/30"
                    }`}
                    aria-label={project.status === "active" ? "Active development" : "Archived"}
                  >
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover/status:block whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background">
                      <div className="font-mono">
                        {project.status === "active" ? "Active development" : "Archived"}
                      </div>
                      {lastUpdated && (
                        <div className="mt-0.5 font-mono text-[10px] opacity-70">
                          Last updated: {lastUpdated}
                        </div>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
