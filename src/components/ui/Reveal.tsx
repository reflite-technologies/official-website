import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.25em] uppercase ${
          tone === "dark"
            ? "border-white/15 bg-white/5 text-primary-glow"
            : "border-primary/25 bg-primary/5 text-primary"
        }`}
      >
        <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" />
        {eyebrow}
      </span>
      <h2
        className={`mt-5 text-3xl leading-[1.05] font-bold text-balance sm:text-4xl lg:text-5xl ${
          tone === "dark" ? "text-ink-foreground" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            tone === "dark" ? "text-ink-foreground/70" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
