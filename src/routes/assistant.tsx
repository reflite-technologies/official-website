import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, MessageSquare } from "lucide-react";
import assistantImg from "@/assets/reflite-assistant.png";
import { createThread, deleteThread, loadThreads, type Thread } from "@/lib/threads";

const title = "REFLITE Assistant | Ask about our services";
const description =
  "Chat with the AI-powered REFLITE Assistant about web design, printing, KRA, HELB, eCitizen and other services in Kaimosi.";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssistantLayout,
});

function AssistantLayout() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const params = useParams({ strict: false }) as { threadId?: string };
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setThreads(loadThreads());
    sync();
    window.addEventListener("reflite-threads", sync);
    return () => window.removeEventListener("reflite-threads", sync);
  }, []);

  const newChat = () => {
    const t = createThread();
    navigate({ to: "/assistant/$threadId", params: { threadId: t.id } });
  };

  const remove = (id: string) => {
    deleteThread(id);
    if (id === params.threadId) {
      const next = loadThreads()[0];
      if (next) navigate({ to: "/assistant/$threadId", params: { threadId: next.id } });
      else navigate({ to: "/assistant" });
    }
  };

  return (
    <div className="flex h-dvh bg-background">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-muted/30 md:flex">
        <div className="flex items-center gap-3 p-4">
          <img src={assistantImg} alt="REFLITE Assistant" width={40} height={40} className="size-10" />
          <div>
            <div className="font-display text-sm font-bold tracking-wide">REFLITE Assistant</div>
            <div className="text-xs text-muted-foreground">AI-powered help</div>
          </div>
        </div>
        <div className="px-3">
          <button
            onClick={newChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" /> New chat
          </button>
        </div>
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center gap-1 rounded-lg ${
                t.id === params.threadId ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <Link
                to="/assistant/$threadId"
                params={{ threadId: t.id }}
                className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm"
              >
                <MessageSquare className="size-3.5 shrink-0" />
                <span className="truncate">{t.title}</span>
              </Link>
              <button
                onClick={() => remove(t.id)}
                aria-label="Delete chat"
                className="mr-1 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link to="/" className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> Back to website
          </Link>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Link to="/" aria-label="Back to website" className="text-muted-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-display text-sm font-bold">REFLITE Assistant</span>
          <button onClick={newChat} aria-label="New chat" className="text-primary">
            <Plus className="size-5" />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
