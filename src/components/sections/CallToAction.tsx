import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-ink-foreground">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[140px] animate-pulse-glow" />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
        <Reveal>
          <h2 className="text-4xl leading-[1.02] font-bold text-balance sm:text-5xl lg:text-6xl">
            READY TO BUILD <span className="text-gradient">SOMETHING AMAZING?</span>
          </h2>
          <p className="mt-5 text-ink-foreground/70">
            Let's turn your idea into a powerful digital experience.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticButton href="#contact">Contact Reflite Technologies</MagneticButton>
            <MagneticButton href="#services" variant="outline">
              Get Started
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
