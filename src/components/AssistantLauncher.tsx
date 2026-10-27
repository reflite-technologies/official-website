import { Link } from "@tanstack/react-router";
import assistantImg from "@/assets/reflite-assistant.png";

export function AssistantLauncher() {
  return (
    <Link
      to="/assistant"
      aria-label="Chat with the REFLITE Assistant"
      className="group fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full glass py-1.5 pr-4 pl-1.5 shadow-lg transition-transform hover:scale-105"
    >
      <img src={assistantImg} alt="" width={44} height={44} className="size-11 animate-float-y" />
      <span className="text-sm font-semibold">Ask REFLITE AI</span>
    </Link>
  );
}
