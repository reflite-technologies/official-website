import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const steps = [
  { n: "01", t: "Tell Us Your Idea", d: "Call, message or walk in. We listen and ask the right questions." },
  { n: "02", t: "We Plan", d: "You get a clear scope, timeline and price before any work starts." },
  { n: "03", t: "We Create", d: "Design, build or process — with updates as we move." },
  { n: "04", t: "You Get Results", d: "Delivered, explained and supported after handover." },
];

export function Process() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="The process"
          title={
            <>
              FOUR STEPS FROM <span className="text-gradient">IDEA TO RESULT</span>
            </>
          }
        />

        <div className="relative mt-16">
          <div className="pointer-events-none absolute top-14 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
          <div className="grid gap-6 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="group relative rounded-3xl glass p-7 transition-transform duration-500 hover:-translate-y-2">
                  <div className="font-display text-5xl font-bold text-primary/25 transition-colors duration-500 group-hover:text-primary/60">
                    {s.n}
                  </div>
                  <div className="mt-4 h-px w-10 bg-primary transition-all duration-500 group-hover:w-20" />
                  <h4 className="mt-5 text-lg font-bold">{s.t}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
