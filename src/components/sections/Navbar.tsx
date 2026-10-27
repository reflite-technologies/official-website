import { useEffect, useState } from "react";
import { Menu, X, Hexagon } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6 ${
          scrolled ? "mt-3" : "mt-0"
        }`}
      >
        <div
          className={`flex w-full items-center justify-between gap-4 rounded-full px-4 py-3 transition-all duration-500 ${
            scrolled ? "glass" : "border border-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-2.5">
            <span className="relative grid size-9 place-items-center rounded-xl [background-image:var(--gradient-primary)] glow-ring">
              <Hexagon className="size-4 text-primary-foreground" strokeWidth={2.4} />
            </span>
            <span className="font-display text-[13px] leading-tight font-bold tracking-[0.18em] sm:text-sm">
              REFLITE
              <span className="block text-[9px] font-medium tracking-[0.34em] text-muted-foreground">
                TECHNOLOGIES
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MagneticButton href="#contact" className="hidden px-5 py-2.5 sm:inline-flex">
              Get Started
            </MagneticButton>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid size-10 place-items-center rounded-full border border-border bg-background/70 lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-3xl glass p-3 lg:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/8 hover:text-primary"
            >
              {l.label}
            </a>
          ))}
          <MagneticButton href="#contact" className="mt-2 w-full">
            Get Started
          </MagneticButton>
        </div>
      )}
    </header>
  );
}
