import { useRef, useState } from "react";
import { SERVICE_GROUPS } from "@/lib/site";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import {
  Code2,
  Globe2,
  ShieldHalf,
  Palette,
  Clapperboard,
  FileUser,
  Printer,
  Copy,
  ScanLine,
  Keyboard,
  Layers,
  Landmark,
  Receipt,
  HeartPulse,
  GraduationCap,
  Plane,
  FileBadge,
  Building2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "Web Development": Code2,
  "Cyber Services": ShieldHalf,
  "Online Applications": Globe2,
  "Graphic Design": Palette,
  "Video Editing": Clapperboard,
  "CV Creation": FileUser,
  Printing: Printer,
  Photocopying: Copy,
  Scanning: ScanLine,
  "Typing & Document Preparation": Keyboard,
  Lamination: Layers,
  "eCitizen Services": Landmark,
  "KRA Services": Receipt,
  "NSSF / SHA": HeartPulse,
  "HELB Services": GraduationCap,
  "Passport & Visa": Plane,
  "Certificate Applications": FileBadge,
  "Business Registration": Building2,
};

function ServiceCard({ name, description }: { name: string; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[name] ?? Code2;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(22px)`;
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative h-full overflow-hidden rounded-3xl glass p-6 tilt-card hover:[box-shadow:var(--shadow-glow)]"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/8 text-primary transition-all duration-500 group-hover:[background-image:var(--gradient-primary)] group-hover:text-primary-foreground group-hover:-translate-y-1">
        <Icon className="size-5" />
      </div>
      <h4 className="relative mt-5 text-base font-semibold">{name}</h4>
      <p className="relative mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-muted-foreground opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100 sm:mt-2">
        {description}
      </p>
    </div>
  );
}

export function Services() {
  const [active, setActive] = useState(SERVICE_GROUPS[0]!.category);
  const group = SERVICE_GROUPS.find((g) => g.category === active) ?? SERVICE_GROUPS[0]!;

  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-70" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              EVERYTHING DIGITAL, <span className="text-gradient">UNDER ONE ROOF</span>
            </>
          }
          description="Eighteen professional services grouped into four practices — pick a category to explore."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {SERVICE_GROUPS.map((g) => (
            <button
              key={g.category}
              onClick={() => setActive(g.category)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active === g.category
                  ? "text-primary-foreground [background-image:var(--gradient-primary)] glow-ring"
                  : "border border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {g.category}
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">{group.blurb}</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item, i) => (
            <Reveal key={item.name} delay={Math.min(i * 0.06, 0.3)}>
              <ServiceCard {...item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
