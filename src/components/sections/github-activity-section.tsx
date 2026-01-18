import { GithubContributions } from "@/components/github-contributions";
import type { ContributionCalendar } from "@/lib/github";

interface GitHubActivitySectionProps {
  githubCalendar: ContributionCalendar | null;
}

export function GitHubActivitySection({ githubCalendar }: GitHubActivitySectionProps) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Crimson Pro, serif" }}>
        GitHub Activity
      </h2>
      {githubCalendar ? (
        <GithubContributions calendar={githubCalendar} />
      ) : (
        <p className="text-sm text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
          Unable to load contributions right now. If you are developing locally, set a
          `GITHUB_TOKEN` environment variable with access to the GitHub GraphQL API or check your
          network connection, then refresh.
        </p>
      )}
    </section>
  );
}
