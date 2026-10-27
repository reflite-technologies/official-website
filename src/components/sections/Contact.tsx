import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { COMPANY, SOCIALS, ALL_SERVICE_NAMES } from "@/lib/site";
import { submitContact } from "@/lib/inbox/inbox.functions";

const field =
  "w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-primary/60 focus:[box-shadow:var(--shadow-glow)]";

export function Contact() {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      await submitContact({
        data: {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          service: String(data.get("service") ?? ""),
          message: String(data.get("message") ?? ""),
        },
      });
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Couldn't send your message. Please call or email us instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-70" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              LET'S TALK ABOUT <span className="text-gradient">YOUR PROJECT</span>
            </>
          }
          description="Send a message, call, or visit us in Kaimosi. We usually reply the same day."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl glass p-7">
              <h3 className="font-display text-lg font-bold tracking-[0.12em]">{COMPANY.name}</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="size-4" />
                  </span>
                  <span className="pt-2 text-muted-foreground">{COMPANY.location}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="size-4" />
                  </span>
                  <a href={COMPANY.phoneHref} className="pt-2 text-muted-foreground hover:text-primary">
                    {COMPANY.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="size-4" />
                  </span>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="pt-2 break-all text-muted-foreground hover:text-primary"
                  >
                    {COMPANY.email}
                  </a>
                </li>
              </ul>

              <div className="mt-8 border-t border-border pt-6">
                <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                  Follow us
                </span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-border px-3.5 py-2 text-xs transition-all duration-300 hover:border-primary/50 hover:text-primary"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-3xl glass p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" required placeholder="Your name" className={field} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className={field}
                />
                <input name="phone" placeholder="Phone number" className={field} />
                <select name="service" defaultValue="" required className={field}>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {ALL_SERVICE_NAMES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about what you need…"
                className={`${field} mt-4 resize-none`}
              />
              <div className="mt-6">
                <MagneticButton type="submit" disabled={sending}>
                  {sending ? "Preparing…" : "Send Message"}
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
