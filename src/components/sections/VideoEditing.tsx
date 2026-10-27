import { Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const tracks = [
  { label: "Video", blocks: [24, 14, 32, 18] },
  { label: "B-roll", blocks: [12, 28, 16, 30] },
  { label: "Audio", blocks: [40, 20, 22] },
  { label: "Motion", blocks: [16, 34, 26] },
];

export function VideoEditing() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-[0.25em] text-primary-glow uppercase">
              Video Editing
            </span>
            <h2 className="mt-6 text-4xl leading-[1] font-bold sm:text-5xl">
              CUT LIKE <span className="text-gradient">CINEMA</span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-ink-foreground/70">
              Weddings, events, adverts, YouTube and social reels — colour graded, sound balanced
              and finished with clean motion graphics.
            </p>
            <div className="mt-9">
              <MagneticButton href="#contact">Create With Us</MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-3xl glass-dark">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    aria-label="Showreel"
                    className="group relative grid size-20 place-items-center rounded-full [background-image:var(--gradient-primary)] glow-ring transition-transform duration-500 hover:scale-110"
                  >
                    <span className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-glow" />
                    <Play className="relative size-7 text-primary-foreground" fill="currentColor" />
                  </button>
                </div>
                <div className="absolute inset-x-0 top-0 flex justify-between px-3 py-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className="h-3 w-2 rounded-[2px] bg-white/12" />
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-between px-3 py-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className="h-3 w-2 rounded-[2px] bg-white/12" />
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-3xl glass-dark p-4">
                {tracks.map((t) => (
                  <div key={t.label} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 font-mono text-[9px] tracking-widest text-ink-foreground/45 uppercase">
                      {t.label}
                    </span>
                    <div className="flex flex-1 gap-1.5">
                      {t.blocks.map((w, i) => (
                        <span
                          key={i}
                          style={{ flexGrow: w }}
                          className={`h-3 rounded-full ${
                            i % 2 ? "bg-primary/35" : "bg-primary/70"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
