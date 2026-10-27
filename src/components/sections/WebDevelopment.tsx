import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Check } from "lucide-react";

const points = [
  "Responsive websites that look right on every screen",
  "Business systems, dashboards and booking tools",
  "Fast loading, secure hosting and clean code",
  "Search-friendly structure from day one",
];

export function WebDevelopment() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div className="pointer-events-none absolute top-1/4 -left-24 size-96 rounded-full bg-primary/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-[0.25em] text-primary-glow uppercase">
            Web Development
          </span>
          <h2 className="mt-6 text-4xl leading-[1] font-bold sm:text-5xl lg:text-6xl">
            YOUR IDEA. <span className="text-gradient">OUR CODE.</span>
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-ink-foreground/70">
            We design and build modern responsive websites and digital systems — from a clean
            one-page business site to a full platform with accounts, payments and dashboards.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink-foreground/80">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary-glow">
                  <Check className="size-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <MagneticButton href="#contact">
              Start Your Project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative [perspective:1400px]">
            <div className="relative rounded-3xl glass-dark p-4 [transform:rotateY(-14deg)_rotateX(8deg)] transition-transform duration-700 hover:[transform:rotateY(-6deg)_rotateX(3deg)]">
              <div className="flex items-center gap-1.5 pb-3">
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-primary/70" />
                <span className="ml-3 font-mono text-[10px] tracking-widest text-ink-foreground/40">
                  reflite.build
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1526] p-5 font-mono text-[11px] leading-6 sm:text-xs">
                <div className="absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-primary/20 to-transparent" />
                <pre className="relative text-ink-foreground/75">
                  <span className="text-primary-glow">const</span> reflite = {"{"}
                  {"\n"} build: <span className="text-primary">"websites & systems"</span>,
                  {"\n"} stack: [<span className="text-primary">"React"</span>,{" "}
                  <span className="text-primary">"Node"</span>,{" "}
                  <span className="text-primary">"Cloud"</span>],
                  {"\n"} delivery: <span className="text-primary">"fast, tested, yours"</span>,
                  {"\n"}
                  {"}"};
                </pre>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[92, 98, 100].map((n, i) => (
                    <div key={n} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-lg font-bold text-primary-glow">{n}</div>
                      <div className="text-[9px] tracking-widest text-ink-foreground/40 uppercase">
                        {["Speed", "SEO", "A11y"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-6 hidden animate-float rounded-2xl glass-dark px-4 py-3 text-xs text-ink-foreground/80 sm:block">
              <span className="text-primary-glow">●</span> Deployed in days, not months
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
