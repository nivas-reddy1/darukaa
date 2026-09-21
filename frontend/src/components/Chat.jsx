import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/client";

// Put your photo in the /public folder (e.g. public/nature.jpg).
// If the file is missing, the green gradient underneath shows instead.
const WALLPAPER = "/nature.jpg";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // The disclaimer lives only until the first message is sent
  const conversationStarted = messages.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { reply } = await sendChatMessage(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${WALLPAPER}), linear-gradient(160deg, #1f3d2b 0%, #3f6b3f 50%, #7fae6a 100%)`,
      }}
    >
      {/* Soft dark veil so the photo doesn't fight the glass panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Frosted glass panel */}
      <div className="relative z-10 w-full max-w-4xl h-[min(660px,85vh)] flex flex-col overflow-hidden rounded-3xl border border-white/30 bg-white/10 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-center gap-2.5 px-6 py-4 border-b border-white/20 bg-white/10 text-white">
          <h1 className="text-lg font-semibold tracking-wide">
            Biodiversity Chatbot
          </h1>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          aria-live="polite"
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3"
        >
          {/* Disclaimer: visible only before the conversation starts */}
          {!conversationStarted && (
            <div className="m-auto max-w-sm text-center text-white/90">
              <p className="text-base font-medium">Before you begin</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                This assistant is powered by AI and can make mistakes. Check
                important information before relying on it.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "self-end bg-emerald-400/90 text-emerald-950 rounded-br-md"
                  : "self-start bg-black/30 text-white border border-white/20 backdrop-blur-sm rounded-bl-md"
              }`}
            >
              <span className="block text-xs font-semibold opacity-70">
                {m.role === "user" ? "You" : "Agent"}
              </span>
              <p className="mt-0.5 whitespace-pre-wrap break-words">
                {m.content}
              </p>
            </div>
          ))}

          {loading && (
            <div className="self-start max-w-[78%] px-3.5 py-2 rounded-2xl rounded-bl-md text-sm bg-black/30 text-white border border-white/20 backdrop-blur-sm">
              <span className="block text-xs font-semibold opacity-70">
                Agent
              </span>
              <p className="mt-0.5">
                Thinking
                <span className="animate-pulse [animation-delay:0ms]">.</span>
                <span className="animate-pulse [animation-delay:200ms]">.</span>
                <span className="animate-pulse [animation-delay:400ms]">.</span>
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-200 bg-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 px-5 py-4 border-t border-white/20 bg-white/10"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            aria-label="Chat message"
            className="flex-1 px-4 py-2.5 rounded-full border border-white/30 bg-white/20 text-sm text-white placeholder-white/60 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-full font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}