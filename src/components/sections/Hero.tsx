import { motion } from "motion/react";
import { ArrowRight, MousePointerClick, ChevronDown } from "lucide-react";
import { ClientScene } from "@/components/three/ClientScene";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { COMPANY } from "@/lib/site";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden mesh-bg">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
      <ClientScene className="pointer-events-none absolute inset-0 h-full w-full opacity-90" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pt-28 pb-24 sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-background/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.28em] uppercase text-primary backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" />
          {COMPANY.location} · Est. {COMPANY.founded}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] font-bold text-balance"
        >
          BUILDING THE <span className="text-gradient">DIGITAL FUTURE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Technology, creativity and digital solutions — all under one roof.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <MagneticButton href="#services">
            Explore Our Services
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Contact Us
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-3"
        >
          {[
            { k: "18+", v: "Services" },
            { k: "2024", v: "Established" },
            { k: "100%", v: "Client focus" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl px-4 py-4">
              <div className="font-display text-xl font-bold text-primary sm:text-2xl">{s.k}</div>
              <div className="mt-1 text-[11px] tracking-wide text-muted-foreground uppercase">
                {s.v}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-muted-foreground">
        <MousePointerClick className="size-3.5 opacity-60" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="size-4 animate-float text-primary" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
