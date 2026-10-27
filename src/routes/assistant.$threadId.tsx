import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import assistantImg from "@/assets/reflite-assistant.png";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ensureThread, updateThreadMessages } from "@/lib/threads";

export const Route = createFileRoute("/assistant/$threadId")({
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    setInitial(ensureThread(threadId).messages);
  }, [threadId]);

  if (!initial) return <div className="flex-1" />;
  return <ChatWindow key={threadId} threadId={threadId} initialMessages={initial} />;
}

const SUGGESTIONS = [
  "What services do you offer?",
  "How can you help me with KRA?",
  "I need a website for my business",
  "What do I need for a HELB application?",
];

function ChatWindow({ threadId, initialMessages }: { threadId: string; initialMessages: UIMessage[] }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { conversationId: threadId } }),
    onError: (err) => toast.error(err.message || "The assistant could not reply. Please try again."),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "ready" || status === "error") {
      if (messages.length > 0) updateThreadMessages(threadId, messages);
      textareaRef.current?.focus();
    }
  }, [status, messages, threadId]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <img src={assistantImg} alt="" width={96} height={96} className="size-24 animate-float-y" />
              <h1 className="mt-4 font-display text-2xl font-bold">
                Hi, I'm the <span className="text-gradient">REFLITE Assistant</span>
              </h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask me about our services, what documents you need, or how to get started.
              </p>
              <div className="mt-8 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-foreground"
                  }
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "assistant" ? (
                        <MessageResponse key={i}>{p.text}</MessageResponse>
                      ) : (
                        <span key={i} className="whitespace-pre-wrap">{p.text}</span>
                      )
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent">
                <Shimmer>Thinking...</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <PromptInput onSubmit={(msg) => send(msg.text ?? "")}>
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our services…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !input.trim()} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          AI answers may be imperfect. For exact details, call or email us.
        </p>
      </div>
    </div>
  );
}
