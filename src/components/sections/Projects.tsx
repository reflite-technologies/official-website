import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import websiteImg from "@/assets/project-website.jpg";
import brandingImg from "@/assets/project-branding.jpg";
import videoImg from "@/assets/project-video.jpg";
import systemImg from "@/assets/project-system.jpg";

const projects = [
  {
    title: "Business Website",
    tag: "Web Development",
    img: websiteImg,
    body: "A responsive company site with services, gallery and enquiry form.",
  },
  {
    title: "Brand Identity Kit",
    tag: "Graphic Design",
    img: brandingImg,
    body: "Logo, stationery and social templates delivered as a full kit.",
  },
  {
    title: "Event Highlight Film",
    tag: "Video Editing",
    img: videoImg,
    body: "Colour graded, sound mixed and cut for social and full-length release.",
  },
  {
    title: "Records Dashboard",
    tag: "Digital Systems",
    img: systemImg,
    body: "A custom system for tracking records, payments and reports.",
  },
];

export function Projects() {
  const [active, setActive] = useState(0);

  return (
    <section id="projects" className="relative overflow-hidden bg-ink py-24 text-ink-foreground sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Selected work"
          tone="dark"
          title={
            <>
              A LOOK AT WHAT WE <span className="text-gradient">DELIVER</span>
            </>
          }
          description="Sample projects showing the range of work we produce for clients."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 [perspective:1600px]">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group relative block h-full w-full overflow-hidden rounded-3xl glass-dark text-left transition-all duration-600 ${
                  active === i
                    ? "[transform:translateZ(40px)_translateY(-10px)] [box-shadow:var(--shadow-glow)]"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-primary-glow uppercase">
                    {p.tag}
                  </span>
                  <h4 className="mt-3 flex items-center gap-1.5 text-lg font-bold">
                    {p.title}
                    <ArrowUpRight className="size-4 text-primary opacity-0 transition-all duration-400 group-hover:opacity-100" />
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-foreground/60">{p.body}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
