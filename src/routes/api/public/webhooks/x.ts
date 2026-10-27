import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// X Account Activity API webhook. Needs secret X_CONSUMER_SECRET.
const sign = (secret: string, data: string) =>
  "sha256=" + createHmac("sha256", secret).update(data).digest("base64");

export const Route = createFileRoute("/api/public/webhooks/x")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const secret = process.env["X_CONSUMER_SECRET"];
        const crc = new URL(request.url).searchParams.get("crc_token");
        if (!secret || !crc) return new Response("Forbidden", { status: 403 });
        return Response.json({ response_token: sign(secret, crc) });
      },
      POST: async ({ request }) => {
        const secret = process.env["X_CONSUMER_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });
        const raw = await request.text();
        const sig = request.headers.get("x-twitter-webhooks-signature") ?? "";
        const expected = sign(secret, raw);
        if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
          return new Response("Invalid signature", { status: 401 });
        }
        const payload = JSON.parse(raw) as {
          for_user_id?: string;
          direct_message_events?: {
            id: string;
            created_timestamp?: string;
            message_create?: { sender_id: string; message_data?: { text?: string } };
          }[];
          users?: Record<string, { name?: string; screen_name?: string }>;
        };
        const rows = (payload.direct_message_events ?? [])
          .filter((e) => e.message_create && e.message_create.sender_id !== payload.for_user_id)
          .map((e) => {
            const u = payload.users?.[e.message_create!.sender_id];
            return {
              channel: "x" as const,
              external_id: e.id,
              thread_id: e.message_create!.sender_id,
              from_name: u?.name ?? "X user",
              from_address: u?.screen_name ? `@${u.screen_name}` : e.message_create!.sender_id,
              subject: "X direct message",
              body: e.message_create!.message_data?.text ?? "",
              received_at: e.created_timestamp ? new Date(Number(e.created_timestamp)).toISOString() : undefined,
            };
          });
        const { saveMessages } = await import("@/lib/inbox/inbox.server");
        await saveMessages(rows);
        return new Response("ok");
      },
    },
  },
});
