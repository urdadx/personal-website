import type { Experience } from "@/data/experience";

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Crimson Pro, serif" }}>
        Experience
      </h2>
      <div className="space-y-3">
        {experience.map((exp) => (
          <div key={exp.company} className="flex justify-between items-start py-2">
            <div>
              <p
                className="text-base font-medium"
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {exp.role}
              </p>
              <p
                className="text-sm text-muted-foreground"
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {exp.company}
              </p>
            </div>
            <span className="text-sm text-muted-foreground font-mono">{exp.period}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
