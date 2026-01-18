import { ComesInGoesOutUnderline } from "@/components/underline/comes-in-goes-out-underline";

export function ContactSection() {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Crimson Pro, serif" }}>
        Contact
      </h2>
      <div className="flex flex-col items-start space-y-2">
        <ComesInGoesOutUnderline
          as="a"
          href="mailto:abassabdulwahab3@gmail.com"
          className="inline-flex text-start font-mono text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
          direction="left"
        >
          abassabdulwahab3@gmail.com
        </ComesInGoesOutUnderline>
        <ComesInGoesOutUnderline
          as="a"
          href="https://github.com/urdadx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-start font-mono text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
          direction="right"
        >
          github.com/urdadx
        </ComesInGoesOutUnderline>
        <ComesInGoesOutUnderline
          as="a"
          href="https://www.linkedin.com/in/abdul-abass/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-start font-mono text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
          direction="left"
        >
          linkedin.com
        </ComesInGoesOutUnderline>
        <ComesInGoesOutUnderline
          as="a"
          href="https://x.com/NerdyProgramme2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-start font-mono text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
          direction="right"
        >
          x.com/NerdyProgramme2
        </ComesInGoesOutUnderline>
      </div>
    </section>
  );
}
