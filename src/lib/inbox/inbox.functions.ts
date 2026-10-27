import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Only the site admin can use the inbox.");
}

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(255),
        phone: z.string().trim().max(30).optional().default(""),
        service: z.string().trim().max(100),
        message: z.string().trim().min(1).max(3000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { saveMessages } = await import("./inbox.server");
    await saveMessages([
      {
        channel: "website",
        external_id: crypto.randomUUID(),
        from_name: data.name,
        from_address: data.email,
        subject: `Enquiry: ${data.service}`,
        body: data.phone ? `${data.message}\n\nPhone: ${data.phone}` : data.message,
      },
    ]);
    return { ok: true };
  });

export const syncEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { syncGmailInbox } = await import("./inbox.server");
    const count = await syncGmailInbox();
    return { count };
  });

export const draftReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: msg, error } = await context.supabase
      .from("inbox_messages")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !msg) throw new Error("Message not found");
    const { draftAiReply } = await import("./inbox.server");
    const draft = await draftAiReply(msg);
    await context.supabase.from("inbox_messages").update({ ai_draft: draft }).eq("id", data.id);
    return { draft };
  });

export const sendReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), text: z.string().trim().min(1).max(5000) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: msg, error } = await context.supabase
      .from("inbox_messages")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !msg) throw new Error("Message not found");
    if (msg.channel !== "email" && msg.channel !== "website")
      throw new Error("Replies to this platform must be sent from the app itself for now.");
    if (!msg.from_address) throw new Error("This message has no reply address.");
    const { sendGmail } = await import("./inbox.server");
    await sendGmail({
      to: msg.from_address,
      subject: msg.subject ?? "Your enquiry",
      body: data.text,
      threadId: msg.channel === "email" ? msg.thread_id : null,
    });
    await context.supabase
      .from("inbox_messages")
      .update({ reply: data.text, status: "replied", replied_at: new Date().toISOString() })
      .eq("id", data.id);
    return { ok: true };
  });
