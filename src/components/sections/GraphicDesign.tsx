import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Brush, Image as ImageIcon, Layout, Shapes, Share2 } from "lucide-react";

const deliverables = [
  { icon: Shapes, title: "Logos", body: "Distinct marks with full colour and mono versions." },
  { icon: Layout, title: "Posters", body: "Event and campaign posters ready for large print." },
  { icon: ImageIcon, title: "Flyers", body: "Persuasive layouts for promos and announcements." },
  { icon: Brush, title: "Branding", body: "Colour, type and identity guidelines you can reuse." },
  { icon: Share2, title: "Social Graphics", body: "Post and story sets sized for every platform." },
];

export function GraphicDesign() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Graphic Design"
          align="left"
          title={
            <>
              DESIGN THAT MAKES PEOPLE <span className="text-gradient">LOOK TWICE</span>
            </>
          }
          description="Every visual we make is built around one job: making your brand unmistakable."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Reveal className="lg:col-span-1 md:row-span-2">
            <div className="relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-3xl [background-image:var(--gradient-primary)] p-7 text-primary-foreground">
              <div className="pointer-events-none absolute -right-10 -bottom-10 size-48 rotate-12 rounded-3xl border-2 border-white/25 animate-float" />
              <div className="pointer-events-none absolute right-10 top-10 size-20 rounded-full border-2 border-white/30" />
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-80">
                Studio
              </span>
              <div>
                <p className="font-display text-3xl leading-tight font-bold">
                  Ideas, sketched, refined and shipped.
                </p>
                <p className="mt-3 text-sm opacity-85">
                  Unlimited concept feedback until the design feels right.
                </p>
              </div>
            </div>
          </Reveal>

          {deliverables.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.07}>
              <div className="group h-full rounded-3xl glass p-6 tilt-card hover:-translate-y-2 hover:[box-shadow:var(--shadow-glow)]">
                <d.icon className="size-6 text-primary transition-transform duration-500 group-hover:scale-110" />
                <h4 className="mt-5 font-semibold">{d.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
