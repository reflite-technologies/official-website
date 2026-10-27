import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { COMPANY, SERVICE_GROUPS, SOCIALS } from "@/lib/site";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const MODEL = "openai/gpt-6-astra";

function systemPrompt() {
  const services = SERVICE_GROUPS.map(
    (g) => `- ${g.category}: ${g.items.map((s) => `${s.name} (${s.description})`).join("; ")}`,
  ).join("\n");
  return `You are the REFLITE Assistant, the friendly helper on the ${COMPANY.name} website.
${COMPANY.name} is a tech and digital services company founded in ${COMPANY.founded}, based in ${COMPANY.location}.
Phone: ${COMPANY.phone}. Email: ${COMPANY.email}.
Socials: ${SOCIALS.map((s) => s.label).join(", ")}.

Services offered:
${services}

Help visitors understand the services, what documents they may need (e.g. ID, KRA PIN) and how to get started.
Never invent prices, opening hours or turnaround times; if asked, say the team will confirm and share the phone/email.
Keep answers short, warm and clear. Use simple language. Use markdown lists when helpful.`;
}

export async function handleChat(request: Request): Promise<Response> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return new Response("AI is not configured", { status: 500 });

  let body: { messages?: UIMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-40) : [];
  if (messages.length === 0) return new Response("No messages", { status: 400 });

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: systemPrompt(),
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
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

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onError: (err) => {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 429) return "The assistant is busy right now. Please try again in a moment.";
        if (status === 402) return "The assistant is temporarily unavailable. Please contact us directly.";
        return "Something went wrong. Please try again.";
      },
    }),
    runIdFetch,
  );
}
