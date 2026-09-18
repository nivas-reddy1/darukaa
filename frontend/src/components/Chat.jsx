import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/client";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

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
      className="relative min-h-screen w-full flex items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
      style={{
        // Swap this in for your wallpaper once it's in your project, e.g.:
        // backgroundImage: `url(${wallpaperImg})`
        backgroundImage:
          "linear-gradient(160deg, #274d2e 0%, #3f6b3f 45%, #6fae5e 100%)",
      }}
    >
      {/* Soft dark veil so the wallpaper doesn't fight the chatbox for attention */}
      <div className="absolute inset-0 bg-gradient-radial from-black/10 to-black/40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl h-[min(640px,80vh)] flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-[#f6f3e9]/90 backdrop-blur-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-green-900 to-green-700 text-[#f6f3e9]">
          <span className="text-2xl" aria-hidden="true">
            🌿
          </span>
          <h1 className="text-lg font-semibold tracking-wide">
            LangGraph Chat
          </h1>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3"
        >
          {messages.length === 0 && !loading && (
            <p className="m-auto italic text-[#4a3826]/60 text-center">
              Say hello to get the conversation growing.
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "self-end bg-green-500 text-green-950 rounded-br-md"
                  : "self-start bg-white text-[#4a3826] border border-green-700/20 rounded-bl-md"
              }`}
            >
              <span className="block text-[0.65rem] font-bold uppercase tracking-wide opacity-70">
                {m.role === "user" ? "You" : "Agent"}
              </span>
              <p className="mt-0.5 whitespace-pre-wrap break-words">
                {m.content}
              </p>
            </div>
          ))}

          {loading && (
            <div className="self-start max-w-[78%] px-3.5 py-2 rounded-2xl rounded-bl-md text-sm bg-white text-[#4a3826] border border-green-700/20 shadow-sm">
              <span className="block text-[0.65rem] font-bold uppercase tracking-wide opacity-70">
                Agent
              </span>
              <p className="mt-0.5">
                thinking
                <span className="animate-pulse [animation-delay:0ms]">.</span>
                <span className="animate-pulse [animation-delay:200ms]">
                  .
                </span>
                <span className="animate-pulse [animation-delay:400ms]">
                  .
                </span>
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 mt-1">Error: {error}</p>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 px-5 py-4 bg-white/50 border-t border-green-700/20"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            aria-label="Chat message"
            className="flex-1 px-4 py-2.5 rounded-full border border-green-700/35 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/40 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-green-800 to-green-500 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}