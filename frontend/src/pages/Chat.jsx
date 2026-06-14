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
  generic: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#238636",
  },

  love: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#ff5c93",
  },

  environment: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#34d399",
  },

  robotics: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#22d3ee",
  },

  coding: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#60a5fa",
  },

  math: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#fbbf24",
  },

  mentor: {
    bg: "#0d1117",
    card: "#161b22",
    accent: "#facc15",
  },
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


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const [input, setInput] = useState("");
  const [context, setContext] = useState("generic");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const theme = THEMES[context];
  const backgroundImage = BACKGROUNDS[context];
  const animationClass = ANIMATIONS[context];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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

      if (selected?.context) {
        setContext(selected.context);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;

    const userMsg = {
      role: "user",
      content: currentInput,
      context,
    };

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
        {
          role: "assistant",
          content: res.data.reply,
          context,
        },
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
  };

  return (
    <div
      className="min-h-screen flex text-white relative overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        transition: "all 0.4s ease",
      }}
    >
      <div
        className={`absolute inset-0 ${animationClass}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat",
          backgroundSize: "600px",
          opacity: 5,
          pointerEvents: "none",
        }}
      />
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="relative z-10 w-80 border-r border-slate-800 flex flex-col"
          style={{
            backgroundColor: `${theme.card}ee`,
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="p-5 border-b border-slate-800">
            <h1 className="font-display text-2xl font-bold">ContextBot</h1>

            <p className="text-slate-400 text-sm mt-1">Hey, {username} 👋</p>
          </div>

          <div className="p-4">
            <button
              onClick={newChat}
              className="w-full text-white py-3 rounded-xl font-semibold"
              style={{
                backgroundColor: theme.accent,
              }}
            >
              + New Chat
            </button>
          </div>

          {/* Session History */}
          <div className="px-4 mb-5">
            <p className="text-slate-500 text-xs uppercase mb-3">
              Recent Chats
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="rounded-xl border transition-all duration-300 overflow-hidden"
                  style={
                    activeSessionId === session._id
                      ? {
                          borderColor: theme.accent,
                          boxShadow: `0 0 15px ${theme.accent}55`,
                          backgroundColor: `${theme.accent}15`,
                        }
                      : {
                          borderColor: "#30363d",
                          backgroundColor: "#161b22",
                        }
                  }
                >
                  <div
                    onClick={() => loadHistory(session._id)}
                    className="cursor-pointer p-3"
                  >
                    {editingSession === session._id ? (
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <div className="truncate font-semibold text-white">
                        {session.title}
                      </div>
                    )}

                    <div className="text-xs text-slate-400 mt-1">
                      {session.context}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-1">
                      {formatDate(session.updated_at)}
                    </div>

                    {activeSessionId === session._id && (
                      <div
                        className="inline-block mt-2 px-2 py-1 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: theme.accent,
                          color: "#fff",
                        }}
                      >
                        ACTIVE
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-700 flex">
                    {editingSession === session._id ? (
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/sessions/${session._id}/rename`, {
                              title: newTitle,
                            });

                            setEditingSession(null);
                            loadSessions();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="flex-1 py-2 text-xs text-green-400 hover:text-green-300"
                      >
                        💾 Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingSession(session._id);
                          setNewTitle(session.title);
                        }}
                        className="flex-1 py-2 text-xs text-blue-400 hover:text-blue-300"
                      >
                        ✏ Rename
                      </button>
                    )}

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await api.delete(`/sessions/${session._id}`);

                          if (activeSessionId === session._id) {
                            setMessages([]);
                            setActiveSessionId(null);
                          }

                          loadSessions();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="flex-1 py-2 text-xs text-red-400 hover:text-red-300 border-l border-slate-700"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contexts */}
          <div className="px-4">
            <p className="text-slate-500 text-xs uppercase mb-3">Contexts</p>

            <div className="space-y-2">
              {CONTEXTS.map((item) => (
                <button
                  key={item.id}
                  disabled={!!activeSessionId}
                  onClick={() => {
                    if (!activeSessionId) {
                      setContext(item.id);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeSessionId ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  style={
                    context === item.id
                      ? {
                          backgroundColor: theme.accent,
                          color: "#fff",
                        }
                      : {
                          backgroundColor: "#161b22",
                          color: "#c9d1d9",
                        }
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full text-red-400 hover:text-red-300 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div
          className="border-b border-slate-800 px-4 py-3 flex items-center gap-3"
          style={{
            backgroundColor: `${theme.card}ee`,
            backdropFilter: "blur(6px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white"
          >
            ☰
          </button>

          <div className="flex items-center gap-3">
            <h2 className="font-semibold capitalize">{context} Assistant</h2>

            {activeSessionId && (
              <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                🔒 Context Locked
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div
                className="max-w-xl w-full p-8 rounded-3xl border text-center"
                style={{
                  backgroundColor: "#161b22ee",
                  borderColor: "#30363d",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-5xl mb-4">
                  {context === "love" && "❤️"}
                  {context === "mentor" && "🧠"}
                  {context === "coding" && "💻"}
                  {context === "math" && "📐"}
                  {context === "robotics" && "🤖"}
                  {context === "environment" && "🌱"}
                  {context === "generic" && "💬"}
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                  {context.charAt(0).toUpperCase() + context.slice(1)} Assistant
                </h2>

                <p className="text-slate-400">
                  Start a conversation and your chat history will be saved
                  automatically in the sidebar.
                </p>

                <div className="mt-5 text-sm text-slate-500">
                  Context Locked • Session History • AI Powered
                </div>
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

        <div className="bg-brand-card border-t border-slate-800 px-4 py-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask your ${context} assistant...`}
            className="flex-1 bg-brand-dark border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="disabled:opacity-50 text-white px-5 py-3 rounded-xl font-display font-semibold"
            style={{
              backgroundColor: theme.accent,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 
