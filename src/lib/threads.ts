import type { UIMessage } from "ai";

export type Thread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };

const KEY = "reflite-assistant-threads";

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Thread[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  window.localStorage.setItem(KEY, JSON.stringify(threads));
  window.dispatchEvent(new Event("reflite-threads"));
}

export function getThread(id: string) {
  return loadThreads().find((t) => t.id === id);
}

export function createThread(): Thread {
  const thread: Thread = { id: crypto.randomUUID().slice(0, 12), title: "New chat", updatedAt: Date.now(), messages: [] };
  saveThreads([thread, ...loadThreads()]);
  return thread;
}

/** Ensure a thread with this id exists (e.g. after reload with an unknown id). */
export function ensureThread(id: string): Thread {
  const existing = getThread(id);
  if (existing) return existing;
  const thread: Thread = { id, title: "New chat", updatedAt: Date.now(), messages: [] };
  saveThreads([thread, ...loadThreads()]);
  return thread;
}

export function updateThreadMessages(id: string, messages: UIMessage[]) {
  const threads = loadThreads();
  const firstUser = messages.find((m) => m.role === "user");
  const firstText = firstUser?.parts.find((p) => p.type === "text");
  const title = firstText && "text" in firstText ? firstText.text.slice(0, 48) : "New chat";
  const next = threads.map((t) => (t.id === id ? { ...t, messages, title, updatedAt: Date.now() } : t));
  saveThreads(next.sort((a, b) => b.updatedAt - a.updatedAt));
}

export function deleteThread(id: string) {
  saveThreads(loadThreads().filter((t) => t.id !== id));
}
