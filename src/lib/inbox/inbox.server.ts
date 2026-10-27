import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { COMPANY, SERVICE_GROUPS } from "@/lib/site";

export type IncomingMessage = {
  channel: "email" | "website" | "instagram" | "x";
  external_id?: string | null;
  thread_id?: string | null;
  from_name?: string | null;
  from_address?: string | null;
  subject?: string | null;
  body: string;
  received_at?: string | undefined;
};

export async function saveMessages(rows: IncomingMessage[]) {
  if (rows.length === 0) return 0;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error, count } = await supabaseAdmin
    .from("inbox_messages")
    .upsert(rows.map(({ received_at, ...r }) => (received_at ? { ...r, received_at } : r)), { onConflict: "channel,external_id", ignoreDuplicates: true, count: "exact" });
  if (error) throw new Error(error.message);
  return count ?? rows.length;
}

// ---------- Gmail ----------
const GMAIL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function gmailHeaders() {
  const lovable = process.env["LOVABLE_API_KEY"];
  const gmail = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovable || !gmail) throw new Error("Gmail is not connected");
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": gmail,
    "Content-Type": "application/json",
  };
}

async function gmailFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${GMAIL}${path}`, { ...init, headers: gmailHeaders() });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Gmail request failed [${res.status}]: ${text}`);
    throw new Error(`Gmail request failed [${res.status}]: ${text}`);
  }
  return res.json();
}

type GmailMsg = {
  id: string;
  threadId: string;
  snippet?: string;
  internalDate?: string;
  payload?: { headers?: { name: string; value: string }[] };
};

function parseFrom(v: string) {
  const m = v.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>/);
  return m ? { name: m[1]!.trim() || m[2]!, address: m[2]! } : { name: v, address: v };
}

export async function syncGmailInbox() {
  const list = (await gmailFetch(
    "/users/me/messages?maxResults=25&labelIds=INBOX&q=newer_than:14d -category:promotions -category:social",
  )) as { messages?: { id: string }[] };
  const ids = (list.messages ?? []).map((m) => m.id);
  const rows: IncomingMessage[] = [];
  for (const id of ids) {
    const m = (await gmailFetch(
      `/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
    )) as GmailMsg;
    const h = (n: string) => m.payload?.headers?.find((x) => x.name.toLowerCase() === n)?.value ?? "";
    const from = parseFrom(h("from"));
    rows.push({
      channel: "email",
      external_id: m.id,
      thread_id: m.threadId,
      from_name: from.name,
      from_address: from.address,
      subject: h("subject") || "(no subject)",
      body: m.snippet ?? "",
      received_at: m.internalDate ? new Date(Number(m.internalDate)).toISOString() : undefined,
    });
  }
  return saveMessages(rows);
}

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

export async function sendGmail(opts: { to: string; subject: string; body: string; threadId?: string | null }) {
  const subject = /^re:/i.test(opts.subject) ? opts.subject : `Re: ${opts.subject}`;
  const raw = [
    `To: ${opts.to}`,
    `Subject: ${header(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    opts.body,
  ].join("\r\n");
  const encoded = b64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  await gmailFetch("/users/me/messages/send", {
    method: "POST",
    body: JSON.stringify({ raw: encoded, ...(opts.threadId ? { threadId: opts.threadId } : {}) }),
  });
}

// ---------- AI drafts ----------
export async function draftAiReply(msg: { from_name: string | null; subject: string | null; body: string; channel: string }) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const services = SERVICE_GROUPS.flatMap((g) => g.items.map((i) => i.name)).join(", ");
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: `You write replies on behalf of ${COMPANY.name} (${COMPANY.location}). Services: ${services}. Phone ${COMPANY.phone}, email ${COMPANY.email}.
Write a short, warm, professional reply to the customer message. Never invent prices, opening hours or turnaround times — say the team will confirm. Sign off as "The Reflite Team". Output only the reply text.`,
    prompt: `Channel: ${msg.channel}\nFrom: ${msg.from_name ?? "Customer"}\nSubject: ${msg.subject ?? ""}\n\n${msg.body}`,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return (await result.text).trim();
}
