import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, Globe, Instagram, AtSign, RefreshCw, Sparkles, Send, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { syncEmail, draftReply, sendReply } from "@/lib/inbox/inbox.functions";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox | Reflite Technologies" },
      { name: "description", content: "All customer messages from email, the website and social media in one place." },
      { property: "og:title", content: "Inbox | Reflite Technologies" },
      { property: "og:description", content: "Unified customer message inbox." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InboxPage,
});

const ICONS = { email: Mail, website: Globe, instagram: Instagram, x: AtSign } as const;
const LABELS = { email: "Email", website: "Website", instagram: "Instagram", x: "X" } as const;
type Channel = keyof typeof ICONS;

function InboxPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "out" | "denied" | "ok">("loading");

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return setState("out");
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setState(isAdmin ? "ok" : "denied");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (state === "out") navigate({ to: "/auth" });
  }, [state, navigate]);

  if (state === "loading" || state === "out") return <div className="min-h-screen" />;
  if (state === "denied")
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <p className="text-lg font-semibold">This account doesn't have inbox access.</p>
          <button onClick={() => supabase.auth.signOut()} className="mt-4 text-sm text-primary">
            Sign out
          </button>
        </div>
      </div>
    );
  return <Inbox />;
}

type Msg = {
  id: string;
  channel: Channel;
  from_name: string | null;
  from_address: string | null;
  subject: string | null;
  body: string;
  received_at: string;
  status: string;
  ai_draft: string | null;
  reply: string | null;
};

function Inbox() {
  const qc = useQueryClient();
  const sync = useServerFn(syncEmail);
  const [filter, setFilter] = useState<Channel | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ["inbox"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inbox_messages")
        .select("*")
        .order("received_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Msg[];
    },
  });

  const doSync = async () => {
    setSyncing(true);
    try {
      await sync();
      await qc.invalidateQueries({ queryKey: ["inbox"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    doSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = filter === "all" ? messages : messages.filter((m) => m.channel === filter);
  const current = messages.find((m) => m.id === selected) ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link to="/" className="font-display text-lg font-bold tracking-wide">
          REFLITE <span className="text-gradient">INBOX</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={doSync}
            disabled={syncing}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50"
          >
            <RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} /> Check email
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            aria-label="Sign out"
            className="rounded-full border border-border p-2 hover:border-primary/50"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 px-5 py-3">
        {(["all", "email", "website", "instagram", "x"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs ${
              filter === c ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {c === "all" ? "All" : LABELS[c]}
          </button>
        ))}
      </div>

      <div className="grid flex-1 gap-4 px-5 pb-5 lg:grid-cols-[380px_1fr]">
        <ul className="max-h-[75vh] space-y-2 overflow-y-auto">
          {shown.length === 0 && <li className="p-6 text-sm text-muted-foreground">No messages yet.</li>}
          {shown.map((m) => {
            const Icon = ICONS[m.channel];
            return (
              <li key={m.id}>
                <button
                  onClick={() => {
                    setSelected(m.id);
                    if (m.status === "new")
                      supabase.from("inbox_messages").update({ status: "read" }).eq("id", m.id).then(() =>
                        qc.invalidateQueries({ queryKey: ["inbox"] }),
                      );
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                    selected === m.id ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="size-3.5" /> {LABELS[m.channel]}
                    <span className="ml-auto">{new Date(m.received_at).toLocaleString()}</span>
                  </div>
                  <p className={`mt-1 truncate text-sm ${m.status === "new" ? "font-bold" : ""}`}>
                    {m.from_name ?? m.from_address}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{m.subject}</p>
                  {m.status === "replied" && <span className="mt-1 inline-block text-[10px] text-primary">Replied</span>}
                </button>
              </li>
            );
          })}
        </ul>
        {current ? (
          <Detail key={current.id} msg={current} />
        ) : (
          <div className="hidden place-items-center rounded-3xl border border-dashed border-border text-sm text-muted-foreground lg:grid">
            Select a message
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ msg }: { msg: Msg }) {
  const qc = useQueryClient();
  const draft = useServerFn(draftReply);
  const send = useServerFn(sendReply);
  const [text, setText] = useState(msg.reply ?? msg.ai_draft ?? "");
  const [drafting, setDrafting] = useState(false);
  const [sending, setSending] = useState(false);
  const canReply = msg.channel === "email" || msg.channel === "website";

  const makeDraft = async () => {
    setDrafting(true);
    try {
      const r = await draft({ data: { id: msg.id } });
      setText(r.draft);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDrafting(false);
    }
  };

  const doSend = async () => {
    setSending(true);
    try {
      await send({ data: { id: msg.id, text } });
      toast.success("Reply sent");
      qc.invalidateQueries({ queryKey: ["inbox"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-3xl glass p-6">
      <p className="text-xs text-muted-foreground">
        {LABELS[msg.channel]} · {msg.from_address}
      </p>
      <h2 className="mt-1 font-display text-xl font-bold">{msg.subject}</h2>
      <p className="mt-1 text-sm">{msg.from_name}</p>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</p>

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Your reply</span>
          <button
            onClick={makeDraft}
            disabled={drafting}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary/50 disabled:opacity-60"
          >
            <Sparkles className="size-3.5 text-primary" /> {drafting ? "Writing…" : "AI draft"}
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Write a reply or ask the AI for a draft…"
          className="mt-3 w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary/60"
        />
        {canReply ? (
          <button
            onClick={doSend}
            disabled={sending || !text.trim()}
            className="mt-3 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Send className="size-4" /> {sending ? "Sending…" : "Send reply by email"}
          </button>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Copy this reply and send it from the {LABELS[msg.channel]} app.
          </p>
        )}
      </div>
    </div>
  );
}
