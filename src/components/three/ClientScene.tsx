import { Suspense, lazy, useEffect, useState } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

/** Renders the WebGL hero only in the browser, after hydration. */
export function ClientScene({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!mounted) return <div className={className} aria-hidden />;

  return (
    <div className={className}>
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </div>
  );
}
