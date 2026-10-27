import { BadgeCheck, Cpu, Sparkles, Headphones } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Professional Services",
    body: "Work delivered to a standard you can hand over without checking twice.",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    body: "Current tools and platforms, so your results stay relevant for years.",
  },
  {
    icon: Sparkles,
    title: "Creative Solutions",
    body: "We solve the problem behind the request, not just the request itself.",
  },
  {
    icon: Headphones,
    title: "Customer-Focused Support",
    body: "Clear communication, honest timelines and help after delivery.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Why choose us"
          title={
            <>
              BUILT ON TRUST, <span className="text-gradient">DELIVERED WITH CARE</span>
            </>
          }
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:[box-shadow:var(--shadow-glow)]">
                <span className="absolute -top-20 left-1/2 size-40 -translate-x-1/2 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative grid size-14 place-items-center rounded-2xl border border-primary/20 bg-primary/8 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <b.icon className="size-6 text-primary" />
                </div>
                <h4 className="relative mt-6 font-semibold">{b.title}</h4>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
