import { blogFrontmatterList } from "@/lib/blog-posts";
import { Link } from "@tanstack/react-router";
import { ComesInGoesOutUnderline } from "../underline/comes-in-goes-out-underline";

export function WritingSection() {
  const recentPosts = blogFrontmatterList.slice(0, 2);

  const formatDateLabel = (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="mb-16">
      <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Crimson Pro, serif" }}>
        Writing
      </h2>

      {recentPosts.length > 0 && (
        <div className="space-y-3 mb-6">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="block group"
            >
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 justify-between py-2 border-b border-border/20 hover:border-border/40 transition-colors">
                <div className="flex-1">
                  <span
                    className="text-base font-medium"
                    style={{
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {post.title}
                  </span>
                  {post.description && (
                    <p
                      className="text-sm text-muted-foreground mt-1"
                      style={{
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-0 sm:ml-4">
                  <span className="text-sm text-muted-foreground font-mono">
                    {formatDateLabel(post.date) ?? "Coming soon"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ComesInGoesOutUnderline
        as="a"
        href="/blog"
        rel="noopener noreferrer"
        className="inline-flex text-start font-mono text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
        direction="right"
      >
        See all blogs →
      </ComesInGoesOutUnderline>
    </section>
  );
}
