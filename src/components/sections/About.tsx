import { useEffect, useRef, useState } from "react";
import { Cpu, Palette, ShieldCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1400, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const pillars = [
  {
    icon: Cpu,
    title: "Technology",
    body: "Websites, digital systems and online services engineered to be fast, secure and easy to use.",
  },
  {
    icon: Palette,
    title: "Creativity",
    body: "Design and video work that gives your brand a confident, professional presence anywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    body: "Documents, applications and government services handled accurately and on time, every time.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="About Reflite"
          title={
            <>
              WE TURN IDEAS INTO <span className="text-gradient">DIGITAL REALITY</span>
            </>
          }
          description="Reflite Technologies is a modern technology and digital services company based in Kaimosi, Kenya. We combine technology and creativity to deliver reliable digital solutions for individuals, businesses, students and organizations."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="group h-full rounded-3xl glass p-7 tilt-card hover:-translate-y-2 hover:[box-shadow:var(--shadow-glow)]">
                <div className="grid size-12 place-items-center rounded-2xl [background-image:var(--gradient-primary)] glow-ring">
                  <p.icon className="size-5 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4">
            {[
              { n: 18, s: "+", l: "Services offered" },
              { n: 2024, s: "", l: "Established" },
              { n: 100, s: "%", l: "Satisfaction focus" },
              { n: 24, s: "h", l: "Typical turnaround" },
            ].map((stat) => (
              <div key={stat.l} className="bg-background px-6 py-8 text-center">
                <div className="font-display text-3xl font-bold text-primary">
                  <Counter to={stat.n} suffix={stat.s} />
                </div>
                <div className="mt-2 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
