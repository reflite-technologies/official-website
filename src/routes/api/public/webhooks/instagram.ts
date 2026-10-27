import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Meta (Instagram Messaging) webhook. Needs secrets META_APP_SECRET and META_VERIFY_TOKEN.
export const Route = createFileRoute("/api/public/webhooks/instagram")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const token = process.env["META_VERIFY_TOKEN"];
        if (
          token &&
          url.searchParams.get("hub.mode") === "subscribe" &&
          url.searchParams.get("hub.verify_token") === token
        ) {
          return new Response(url.searchParams.get("hub.challenge") ?? "", { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },
      POST: async ({ request }) => {
        const secret = process.env["META_APP_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });
        const raw = await request.text();
        const sig = request.headers.get("x-hub-signature-256") ?? "";
        const expected = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
        if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
          return new Response("Invalid signature", { status: 401 });
        }
        const payload = JSON.parse(raw) as {
          entry?: { messaging?: { sender?: { id: string }; timestamp?: number; message?: { mid: string; text?: string; is_echo?: boolean } }[] }[];
        };
        const rows = (payload.entry ?? []).flatMap((e) =>
          (e.messaging ?? [])
            .filter((m) => m.message && !m.message.is_echo)
            .map((m) => ({
              channel: "instagram" as const,
              external_id: m.message!.mid,
              thread_id: m.sender?.id ?? null,
              from_name: "Instagram user",
              from_address: m.sender?.id ?? null,
              subject: "Instagram message",
              body: m.message!.text ?? "(attachment)",
              received_at: m.timestamp ? new Date(m.timestamp).toISOString() : undefined,
            })),
        );
        const { saveMessages } = await import("@/lib/inbox/inbox.server");
        await saveMessages(rows);
        return new Response("ok");
      },
    },
  },
});
