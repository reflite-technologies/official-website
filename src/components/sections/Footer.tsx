import { Hexagon, MapPin, Phone, Mail } from "lucide-react";
import { COMPANY, NAV_LINKS, SOCIALS, SERVICE_GROUPS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute -top-40 left-1/3 size-96 rounded-full bg-primary/15 blur-[130px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl [background-image:var(--gradient-primary)]">
              <Hexagon className="size-4 text-primary-foreground" strokeWidth={2.4} />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.18em]">
              REFLITE
              <span className="block text-[9px] font-medium tracking-[0.34em] text-ink-foreground/50">
                TECHNOLOGIES
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-foreground/60">
            A modern technology and digital services company delivering technology, creative and
            document solutions from Kaimosi, Kenya.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.28em] text-primary-glow uppercase">
            Services
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-foreground/60">
            {SERVICE_GROUPS.flatMap((g) => g.items)
              .slice(0, 8)
              .map((s) => (
                <li key={s.name}>
                  <a href="#services" className="transition-colors hover:text-primary-glow">
                    {s.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.28em] text-primary-glow uppercase">
            Quick links
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-foreground/60">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-primary-glow">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.28em] text-primary-glow uppercase">
            Contact
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-ink-foreground/60">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-primary" /> {COMPANY.location}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-primary" />
              <a href={COMPANY.phoneHref} className="hover:text-primary-glow">
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-primary" />
              <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-primary-glow">
                {COMPANY.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-ink-foreground/70 transition-colors hover:border-primary/60 hover:text-primary-glow"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-5 py-6 text-center text-xs text-ink-foreground/45 sm:px-6">
        © 2026 Reflite Technologies. All Rights Reserved.
      </div>
    </footer>
  );
}
