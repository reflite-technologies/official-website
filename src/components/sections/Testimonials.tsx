import { useEffect, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = { id: string; quote: string; name: string; rating: number };

const starter: Testimonial[] = [
  {
    id: "s1",
    quote:
      "Reflite built our school portal and trained our staff on it. Everything worked from day one and they still pick up the phone when we need them.",
    name: "Grace A.",
    rating: 5,
  },
  {
    id: "s2",
    quote:
      "They designed my logo, branding and shop flyers in one week. My customers keep telling me the shop looks serious now.",
    name: "Brian O.",
    rating: 5,
  },
  {
    id: "s3",
    quote: "My HELB and KRA applications were handled quickly and correctly. No queues, no mistakes, no stress.",
    name: "Mercy W.",
    rating: 5,
  },
];

const field =
  "w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-primary/60";

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star className={`size-5 ${n <= value ? "fill-primary text-primary" : "text-border"}`} />
        </button>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(starter);
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, quote, name, rating")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data && data.length) setItems([...data, ...starter]);
      });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(id);
  }, [items.length]);

  const go = (dir: number) => setIndex((i) => (i + dir + items.length) % items.length);
  const current = (items[index] ?? items[0])!;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const quote = String(data.get("quote") ?? "").trim();
    if (name.length < 1 || name.length > 80) {
      toast.error("Please enter your name (max 80 characters).");
      return;
    }
    if (quote.length < 10 || quote.length > 600) {
      toast.error("Your testimonial should be between 10 and 600 characters.");
      return;
    }
    setSending(true);
    const { data: row, error } = await supabase
      .from("testimonials")
      .insert({ name, quote, rating })
      .select("id, quote, name, rating")
      .single();
    setSending(false);
    if (error || !row) {
      toast.error("Could not post your testimonial. Please try again.");
      return;
    }
    setItems((prev) => [row, ...prev]);
    setIndex(0);
    setRating(5);
    form.reset();
    toast.success("Thank you! Your testimonial is now live.");
  };

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              WHAT OUR CLIENTS <span className="text-gradient">SAY</span>
            </>
          }
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-3xl glass p-8 sm:p-10">
              <Quote className="size-8 text-primary/40" />
              <div className="mt-4">
                <Stars value={current.rating} />
              </div>
              <p key={current.id} className="mt-4 text-lg leading-relaxed text-balance animate-fade-in">
                {current.quote}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full [background-image:var(--gradient-primary)] font-display text-sm font-bold text-primary-foreground">
                  {current.name.charAt(0).toUpperCase()}
                </span>
                <div className="text-sm font-semibold">{current.name}</div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                {index + 1} / {items.length}
              </span>
              <button
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <Reveal>
            <form onSubmit={submit} className="h-full rounded-3xl glass p-8 sm:p-10">
              <h3 className="font-display text-xl font-bold">Share your experience</h3>
              <p className="mt-1 text-sm text-muted-foreground">Worked with us? Tell others how it went.</p>
              <div className="mt-6">
                <span className="text-sm font-medium">Your rating</span>
                <div className="mt-2">
                  <Stars value={rating} onChange={setRating} />
                </div>
              </div>
              <input name="name" required maxLength={80} placeholder="Your name" className={`${field} mt-5`} />
              <textarea
                name="quote"
                required
                minLength={10}
                maxLength={600}
                rows={4}
                placeholder="What did you like about our service?"
                className={`${field} mt-4 resize-none`}
              />
              <div className="mt-6">
                <MagneticButton type="submit" disabled={sending}>
                  {sending ? "Posting…" : "Post Testimonial"}
                  <Send className="size-4" />
                </MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
