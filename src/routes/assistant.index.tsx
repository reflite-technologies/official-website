import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { createThread, loadThreads } from "@/lib/threads";

export const Route = createFileRoute("/assistant/")({
  component: AssistantIndex,
});

function AssistantIndex() {
  const navigate = useNavigate();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const existing = loadThreads().find((t) => t.messages.length === 0) ?? null;
    const t = existing ?? createThread();
    navigate({ to: "/assistant/$threadId", params: { threadId: t.id }, replace: true });
  }, [navigate]);
  return <div className="flex-1" />;
}
