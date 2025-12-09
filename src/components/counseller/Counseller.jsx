import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";

function Counseller() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (userId) {
      fetchHistory(userId);
    }
    checkHealth();
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const checkHealth = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/counseller/health");
      if (!res.ok) throw new Error("Health check failed");
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({ status: "down" }, err);
    }
  };

  const fetchHistory = async (uid = userId) => {
    if (!uid) return;
    try {
      const res = await fetch("http://localhost:8080/api/counseller/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: uid }),
      });
      if (!res.ok) throw new Error("Failed to load history");
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load history");
    }
  };

  const handleSend = async () => {
    if (!userId) {
      setError("Please set a user ID first");
      return;
    }
    if (!message.trim()) return;

    setError(null);
    setLoading(true);

    const userMsg = { role: "user", content: message.trim() };
    const optimisticHistory = [...history, userMsg];
    setHistory(optimisticHistory);

    try {
      const res = await fetch("http://localhost:8080/api/counseller/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      const botMessage = data.response;

      setHistory([
        ...optimisticHistory,
        { role: "assistant", content: botMessage },
      ]);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
      // optionally revert optimistic update:
      setHistory(history);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:8080/api/counseller/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to clear history");
      await res.json(); // not used, but ensures body is read
      setHistory([]);
    } catch (err) {
      console.error(err);
      setError("Failed to clear history");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 py-4">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Career Mentor
            </h1>
            <p className="text-sm text-slate-400">Your AI career counsellor</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                health && health.status === "healthy"
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            />
            <span>
              {health
                ? `${health.status} (${health.active_sessions || 0} sessions)`
                : "Checking..."}
            </span>
          </div>
        </header>

        {/* Chat container */}
        <div className="flex flex-1 flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-200">Chat</h2>
            <button
              onClick={handleClearHistory}
              disabled={!userId}
              className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear History
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-slate-900 bg-slate-950 px-3 py-3 text-sm">
            {history.length ||
              (!history === 0 && (
                <div className="mt-12 text-center text-xs text-slate-500">
                  Start a conversation with your AI career mentor.
                </div>
              ))}
            {console.log("bruhhhhhhh ", history)}
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] text-slate-200">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm border border-slate-800 bg-slate-950 text-slate-100"
                  }`}
                >
                  <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    {msg.role === "user" ? "You" : "Career Mentor"}
                  </div>
                  <div className="whitespace-pre-wrap text-xs leading-relaxed">
                    {msg.content}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] text-slate-200">
                    U
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="mt-1 flex items-end gap-2">
            <textarea
              rows={2}
              placeholder={
                userId
                  ? "Type your message and press Enter..."
                  : "Set a user ID to start chatting..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!userId || loading}
              className="min-h-[44px] flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-600 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!userId || loading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>

          {error && <div className="mt-1 text-xs text-amber-400">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Counseller;
