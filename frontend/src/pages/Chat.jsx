import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MessageBubble from "../components/MessageBubble";

const CONTEXTS = [
  { id: "generic", label: "💬 Generic" },
  { id: "love", label: "❤️ Love" },
  { id: "mentor", label: "🧠 Mentor" },
  { id: "coding", label: "💻 Coding" },
  { id: "math", label: "📐 Math" },
  { id: "robotics", label: "🤖 Robotics" },
  { id: "environment", label: "🌱 Environment" },
];

const THEMES = {
  generic: { bg: "#0d1117", card: "#161b22", accent: "#238636" },
  love: { bg: "#0d1117", card: "#161b22", accent: "#ff5c93" },
  environment: { bg: "#0d1117", card: "#161b22", accent: "#34d399" },
  robotics: { bg: "#0d1117", card: "#161b22", accent: "#22d3ee" },
  coding: { bg: "#0d1117", card: "#161b22", accent: "#60a5fa" },
  math: { bg: "#0d1117", card: "#161b22", accent: "#fbbf24" },
  mentor: { bg: "#0d1117", card: "#161b22", accent: "#facc15" },
};

const BACKGROUNDS = {
  generic: "/backgrounds/generic.svg",
  love: "/backgrounds/love.svg",
  environment: "/backgrounds/environment.svg",
  robotics: "/backgrounds/robotics.svg",
  coding: "/backgrounds/coding.svg",
  math: "/backgrounds/math.svg",
  mentor: "/backgrounds/mentor.svg",
};

const ANIMATIONS = {
  generic: "",
  love: "bg-love",
  environment: "bg-environment",
  robotics: "bg-robotics",
  coding: "bg-coding",
  math: "bg-math",
  mentor: "bg-mentor",
};

// Theme-specific welcome content
const WELCOME = {
  generic: {
    emoji: "💬",
    headline: "What's on your mind?",
    sub: "Ask me anything — ideas, questions, drafts, decisions. I'm here for all of it.",
  },
  love: {
    emoji: "❤️",
    headline: "Let's talk about what matters most.",
    sub: "Relationships, feelings, hard conversations. A safe space to think things through.",
  },
  mentor: {
    emoji: "🧠",
    headline: "Ready to level up?",
    sub: "Share your goals, challenges, or something you're learning. Let's figure it out together.",
  },
  coding: {
    emoji: "💻",
    headline: "Ship something great today.",
    sub: "Paste your code, describe a bug, or plan an architecture. Let's build.",
  },
  math: {
    emoji: "📐",
    headline: "Numbers don't lie. Let's prove it.",
    sub: "Problems, proofs, or concepts — walk me through what you're working on.",
  },
  robotics: {
    emoji: "🤖",
    headline: "Let's engineer something real.",
    sub: "Sensors, actuators, algorithms, or circuits — bring your robotics challenge here.",
  },
  environment: {
    emoji: "🌱",
    headline: "Small actions, big impact.",
    sub: "Sustainability, ecology, climate — ask your questions or explore what you can do.",
  },
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [hoveredSession, setHoveredSession] = useState(null);

  const [input, setInput] = useState("");
  const [context, setContext] = useState("generic");
  const [loading, setLoading] = useState(false);

  const isMobile = () => window.innerWidth < 768;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());

  const bottomRef = useRef(null);
  const renameInputRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const theme = THEMES[context];
  const backgroundImage = BACKGROUNDS[context];
  const animationClass = ANIMATIONS[context];
  const welcome = WELCOME[context];

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus rename input when editing starts
  useEffect(() => {
    if (editingSession && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingSession]);

  const loadSessions = async () => {
    try {
      const res = await api.get("/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async (sessionId) => {
    try {
      const res = await api.get(`/history/${sessionId}`);
      setMessages(res.data.messages);
      setActiveSessionId(sessionId);
      const selected = sessions.find((s) => s._id === sessionId);
      if (selected?.context) setContext(selected.context);
    } catch (err) {
      console.error(err);
    }
    if (isMobile()) setSidebarOpen(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const userMsg = { role: "user", content: currentInput, context };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chat", {
        message: currentInput,
        context,
        session_id: activeSessionId,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply, context },
      ]);
      if (!activeSessionId && res.data.session_id) {
        setActiveSessionId(res.data.session_id);
        loadSessions();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Try again.",
          context,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const newChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    if (isMobile()) setSidebarOpen(false);
  };

  const handleContextSelect = (id) => {
    if (!activeSessionId) setContext(id);
    if (isMobile()) setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebarOnMobile = () => {
    if (isMobile()) setSidebarOpen(false);
  };

  const startRename = (e, session) => {
    e.stopPropagation();
    setEditingSession(session._id);
    setNewTitle(session.title);
  };

  const confirmRename = async (e, sessionId) => {
    e?.stopPropagation();
    try {
      await api.put(`/sessions/${sessionId}/rename`, { title: newTitle });
      setEditingSession(null);
      loadSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRename = (e) => {
    e?.stopPropagation();
    setEditingSession(null);
  };

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await api.delete(`/sessions/${sessionId}`);
      if (activeSessionId === sessionId) {
        setMessages([]);
        setActiveSessionId(null);
      }
      loadSessions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="flex text-white relative overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        transition: "all 0.4s ease",
        height: "100dvh",
        width: "100vw",
      }}
    >
      {/* Background SVG layer */}
      <div
        className={`absolute inset-0 ${animationClass}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat",
          backgroundSize: "600px",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 md:hidden"
          style={{ zIndex: 20 }}
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* ── SIDEBAR ── */}
      <div
        className="flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-300"
        style={{
          position: isMobile() ? "fixed" : "relative",
          top: 0,
          left: 0,
          bottom: 0,
          width: isMobile() ? "min(80vw, 300px)" : "18rem",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          zIndex: isMobile() ? 30 : 10,
          backgroundColor: `${theme.card}ee`,
          backdropFilter: "blur(6px)",
          display: !sidebarOpen && !isMobile() ? "none" : "flex",
        }}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 shrink-0">
          <h1 className="font-display text-2xl font-bold">ContextBot</h1>
          <p className="text-slate-400 text-sm mt-1">Hey, {username} 👋</p>
        </div>

        {/* New Chat */}
        <div className="p-4 shrink-0">
          <button
            onClick={newChat}
            className="w-full text-white py-3 rounded-xl font-semibold"
            style={{ backgroundColor: theme.accent }}
          >
            + New Chat
          </button>
        </div>

        {/* ── CONTEXTS (above recent chats so they're always visible) ── */}
        <div className="px-4 shrink-0">
          <p className="text-slate-500 text-xs uppercase mb-3">Contexts</p>
          <div className="space-y-1.5">
            {CONTEXTS.map((item) => (
              <button
                key={item.id}
                disabled={!!activeSessionId}
                onClick={() => handleContextSelect(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm ${
                  activeSessionId ? "opacity-60 cursor-not-allowed" : ""
                }`}
                style={
                  context === item.id
                    ? { backgroundColor: theme.accent, color: "#fff" }
                    : { backgroundColor: "#0d1117", color: "#c9d1d9" }
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 my-4 border-t border-slate-800" />

        {/* ── RECENT CHATS (scrollable, below contexts) ── */}
        <div className="px-4 flex-1 overflow-y-auto min-h-0">
          <p className="text-slate-500 text-xs uppercase mb-3">Recent Chats</p>

          <div className="space-y-1">
            {sessions.map((session) => {
              const isActive = activeSessionId === session._id;
              const isEditing = editingSession === session._id;
              const isHovered = hoveredSession === session._id;

              return (
                <div
                  key={session._id}
                  className="group relative rounded-xl border transition-all duration-200"
                  style={
                    isActive
                      ? {
                          borderColor: theme.accent,
                          boxShadow: `0 0 12px ${theme.accent}44`,
                          backgroundColor: `${theme.accent}18`,
                        }
                      : {
                          borderColor: isHovered ? "#3d444d" : "#30363d",
                          backgroundColor: isHovered ? "#1c2128" : "#161b22",
                        }
                  }
                  onMouseEnter={() => setHoveredSession(session._id)}
                  onMouseLeave={() => setHoveredSession(null)}
                >
                  {isEditing ? (
                    /* ── Inline rename row ── */
                    <div
                      className="flex items-center gap-2 px-3 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        ref={renameInputRef}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename(e, session._id);
                          if (e.key === "Escape") cancelRename(e);
                        }}
                        className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-slate-400"
                        style={{ minWidth: 0 }}
                      />
                      <button
                        onClick={(e) => confirmRename(e, session._id)}
                        title="Save"
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-green-500 bg-opacity-20 text-green-400 hover:bg-opacity-40 transition-all"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelRename}
                        title="Cancel"
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 text-slate-400 hover:text-white transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    /* ── Normal session row ── */
                    <div
                      onClick={() => loadHistory(session._id)}
                      className="cursor-pointer px-3 py-2.5 flex items-center gap-2"
                    >
                      {/* Title + timestamp */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-sm text-white">
                            {session.title}
                          </span>
                          {isActive && (
                            <span
                              className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide"
                              style={{
                                backgroundColor: theme.accent,
                                color: "#fff",
                              }}
                            >
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {formatDate(session.updated_at)}
                        </div>
                      </div>

                      {/* Action buttons — visible on hover/touch */}
                      <div
                        className="flex items-center gap-1 shrink-0 transition-opacity duration-150"
                        style={{ opacity: isHovered || isMobile() ? 1 : 0 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Rename */}
                        <button
                          onClick={(e) => startRename(e, session)}
                          title="Rename"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs"
                        >
                          ✏
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => deleteSession(e, session._id)}
                          title="Delete"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-all text-xs"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={logout}
            className="w-full text-red-400 hover:text-red-300 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div
        className="flex flex-col min-w-0"
        style={{ flex: 1, zIndex: 10, position: "relative" }}
      >
        {/* Header */}
        <div
          className="border-b border-slate-800 px-4 py-3 flex items-center gap-3 shrink-0"
          style={{
            backgroundColor: `${theme.card}ee`,
            backdropFilter: "blur(6px)",
          }}
        >
          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white text-lg"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Desktop: context name + lock */}
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-semibold capitalize">{context} Assistant</h2>
            {activeSessionId && (
              <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                🔒 Context Locked
              </span>
            )}
          </div>

          {/* Mobile: app name only */}
          <div className="flex md:hidden items-center">
            <h2 className="font-semibold">ContextBot</h2>
          </div>
        </div>

        {/* Messages */}
        <div
          className="px-4 py-4 space-y-3 overflow-y-auto"
          style={{ flex: 1, minHeight: 0 }}
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full max-w-lg mx-auto p-6 md:p-10 rounded-3xl border text-center"
                style={{
                  backgroundColor: "#161b22cc",
                  borderColor: "#30363d",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-6xl mb-5">{welcome.emoji}</div>

                <h2
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: theme.accent }}
                >
                  {welcome.headline}
                </h2>

                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {welcome.sub}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {loading && (
            <div className="flex gap-1 ml-2">
              <span
                className="w-2 h-2 bg-brand-soft rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-brand-soft rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-brand-soft rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="border-t border-slate-800 px-4 py-4 flex gap-3 shrink-0"
          style={{
            backgroundColor: `${theme.card}ee`,
            backdropFilter: "blur(6px)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask your ${context} assistant...`}
            className="flex-1 bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none"
            style={{ borderColor: theme.accent }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-50 shrink-0"
            style={{ backgroundColor: theme.accent }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
