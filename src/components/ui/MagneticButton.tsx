import { useRef, type ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "text-primary-foreground [background-image:var(--gradient-primary)] glow-ring hover:brightness-110",
  ghost:
    "border border-primary/25 bg-primary/5 text-primary hover:bg-primary/10",
  outline:
    "border border-white/20 bg-white/5 text-ink-foreground hover:border-primary/60 hover:bg-primary/10",
};

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  const cls = `group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-[transform,background,box-shadow,filter] duration-300 will-change-transform disabled:opacity-60 ${styles[variant]} ${className}`;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  );
}
