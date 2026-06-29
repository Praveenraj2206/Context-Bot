import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MessageBubble from "../components/MessageBubble";

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTEXTS = [
  {
    id: "generic",
    label: "💬 Generic",
    name: "Generic",
    desc: "All-purpose assistant for everyday questions and ideas.",
    accent: "#238636",
  },
  {
    id: "love",
    label: "❤️ Love",
    name: "Love",
    desc: "Navigate relationships, feelings, and hard conversations.",
    accent: "#ff5c93",
  },
  {
    id: "mentor",
    label: "🧠 Mentor",
    name: "Mentor",
    desc: "Goal-setting, career growth, and personal development.",
    accent: "#facc15",
  },
  {
    id: "coding",
    label: "💻 Coding",
    name: "Coding",
    desc: "Debug code, plan architecture, and ship faster.",
    accent: "#60a5fa",
  },
  {
    id: "math",
    label: "📐 Math",
    name: "Math",
    desc: "Proofs, problems, and concepts explained clearly.",
    accent: "#fbbf24",
  },
  {
    id: "robotics",
    label: "🤖 Robotics",
    name: "Robotics",
    desc: "Sensors, actuators, algorithms, and embedded systems.",
    accent: "#22d3ee",
  },
  {
    id: "environment",
    label: "🌱 Environment",
    name: "Environment",
    desc: "Sustainability, ecology, and climate action.",
    accent: "#34d399",
  },
];

const FEATURES = [
  {
    icon: "🎭",
    title: "Multiple AI Contexts",
    desc: "Seven specialized assistants, each tuned for a distinct domain — not one model trying to do everything.",
    accent: "#60a5fa",
  },
  {
    icon: "🗂️",
    title: "Persistent Chat History",
    desc: "Every conversation is saved and searchable. Pick up exactly where you left off.",
    accent: "#34d399",
  },
  {
    icon: "🔊",
    title: "AI Voice Responses",
    desc: "Powered by Murf, your assistant can speak. Listen instead of read when your hands are busy.",
    accent: "#facc15",
  },
  {
    icon: "🔐",
    title: "Secure Sessions",
    desc: "Your chats are private. Authentication protects every session and keeps history yours alone.",
    accent: "#ff5c93",
  },
];

const GUEST_LIMIT = 5;

// ─── Inline CSS ───────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .hb-display { font-family: 'Space Grotesk', sans-serif; }

  /* Fade-up animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.15s; }
  .fade-up-3 { animation-delay: 0.25s; }
  .fade-up-4 { animation-delay: 0.35s; }

  /* Ambient glow pulse */
  @keyframes glowPulse {
    0%, 100% { opacity: 0.18; }
    50%       { opacity: 0.32; }
  }
  .glow-pulse { animation: glowPulse 4s ease-in-out infinite; }

  /* Feature card hover */
  .feat-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    cursor: default;
  }
  .feat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }

  /* Context card hover */
  .ctx-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    cursor: pointer;
  }
  .ctx-card:hover {
    transform: translateY(-6px) scale(1.02);
  }

  /* Nav link */
  .nav-link {
    color: #8b949e;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.15s;
  }
  .nav-link:hover { color: #e6edf3; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }

  /* Chat bubble in guest panel */
  .guest-chat-area::-webkit-scrollbar { width: 4px; }
  .guest-chat-area::-webkit-scrollbar-thumb { background: #30363d; }

  /* Blur overlay */
  .blur-overlay {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    background: rgba(13,17,23,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    border-radius: inherit;
  }

  /* Typing dots */
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
  .dot { animation: bounce 1.2s infinite; display: inline-block; }
  .dot:nth-child(2) { animation-delay: 0.15s; }
  .dot:nth-child(3) { animation-delay: 0.3s; }

  /* Mobile nav */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mobile-nav { animation: slideDown 0.2s ease; }

  /* Shimmer on hero badge */
  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position: 200% center; }
  }
  .shimmer-badge {
    background: linear-gradient(90deg, #238636 0%, #34d399 40%, #60a5fa 60%, #238636 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();

  // Nav
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Guest chat
  const [guestContext, setGuestContext] = useState(null);
  const [guestMessages, setGuestMessages] = useState([]);
  const [guestInput, setGuestInput] = useState("");
  const [guestRemaining, setGuestRemaining] = useState(GUEST_LIMIT);
  const [guestLoading, setGuestLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chatBottomRef = useRef(null);
  const guestChatRef = useRef(null);

  // Scroll sections into view
  const featRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [guestMessages]);

  const openGuestContext = (ctx) => {
    setGuestContext(ctx);
    setGuestMessages([]);
    setGuestInput("");
    setGuestRemaining(GUEST_LIMIT);
    setShowModal(false);
    setTimeout(() => {
      guestChatRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const closeGuestChat = () => {
    setGuestContext(null);
    setGuestMessages([]);
    setShowModal(false);
  };

  const sendGuestMessage = async () => {
    if (!guestInput.trim() || guestRemaining <= 0 || guestLoading) return;
    const text = guestInput.trim();
    const userMsg = { role: "user", content: text, context: guestContext.id };
    setGuestMessages((p) => [...p, userMsg]);
    setGuestInput("");
    setGuestLoading(true);

    const next = guestRemaining - 1;
    setGuestRemaining(next);

    try {
      const res = await api.post("/guest-chat", {
        message: text,
        context: guestContext.id,
      });
      setGuestMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: res.data.reply,
          context: guestContext.id,
        },
      ]);
    } catch {
      setGuestMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: "Something went wrong. Try again.",
          context: guestContext.id,
        },
      ]);
    } finally {
      setGuestLoading(false);
      if (next <= 0) setShowModal(true);
    }
  };

  const handleGuestKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendGuestMessage();
    }
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{globalStyles}</style>

      <div
        style={{
          background: "#0d1117",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {/* ── Ambient background orbs ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            className="glow-pulse"
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              top: -200,
              left: -200,
              background:
                "radial-gradient(circle, #23863622 0%, transparent 70%)",
            }}
          />
          <div
            className="glow-pulse"
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              bottom: 0,
              right: -100,
              background:
                "radial-gradient(circle, #60a5fa18 0%, transparent 70%)",
              animationDelay: "2s",
            }}
          />
        </div>

        {/* ── NAVBAR ── */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(13,17,23,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #21262d",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 1.5rem",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span style={{ fontSize: "1.4rem" }}>🤖</span>
              <span
                className="hb-display"
                style={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#e6edf3",
                }}
              >
                ContextBot
              </span>
            </div>

            {/* Desktop nav */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "2rem" }}
              className="desktop-nav"
            >
              <a
                href="#features"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(featRef);
                }}
              >
                Features
              </a>
              <a
                href="#contexts"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(ctxRef);
                }}
              >
                Contexts
              </a>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "1px solid #30363d",
                  borderRadius: 8,
                  color: "#e6edf3",
                  padding: "0.4rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#8b949e")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#30363d")}
              >
                Login
              </button>
              <button
                onClick={() => {
                  if (!guestContext) {
                    openGuestContext(CONTEXTS[0]); // Opens Generic Assistant
                  } else {
                    guestChatRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
                style={{
                  background: "#238636",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  padding: "0.4rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#2ea043")}
                onMouseLeave={(e) => (e.target.style.background = "#238636")}
              >
                Try Free
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNavOpen((p) => !p)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#8b949e",
                fontSize: "1.4rem",
                cursor: "pointer",
                lineHeight: 1,
              }}
              className="hamburger-btn"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileNavOpen && (
            <div
              className="mobile-nav"
              style={{
                borderTop: "1px solid #21262d",
                background: "#161b22",
                padding: "1rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <a
                href="#features"
                className="nav-link"
                style={{ fontSize: "1rem" }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(featRef);
                }}
              >
                Features
              </a>
              <a
                href="#contexts"
                className="nav-link"
                style={{ fontSize: "1rem" }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(ctxRef);
                }}
              >
                Contexts
              </a>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "1px solid #30363d",
                  borderRadius: 8,
                  color: "#e6edf3",
                  padding: "0.6rem 1rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "#238636",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  padding: "0.6rem 1rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "5rem 1.5rem 4rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left */}
          <div>
            <div
              className="fade-up fade-up-1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 20,
                padding: "0.3rem 0.9rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              <span className="shimmer-badge">
                One AI. Multiple Personalities.
              </span>
            </div>

            <h1
              className="hb-display fade-up fade-up-2"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#e6edf3",
                marginBottom: "1.25rem",
              }}
            >
              Choose the right AI for{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #238636, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                every
              </span>{" "}
              conversation.
            </h1>

            <p
              className="fade-up fade-up-3"
              style={{
                color: "#8b949e",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                marginBottom: "2rem",
                maxWidth: 460,
              }}
            >
              Instead of one generic chatbot, ContextBot provides specialized AI
              assistants designed for different real-world scenarios — from
              debugging code to navigating relationships.
            </p>

            <div
              className="fade-up fade-up-4"
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            >
              <button
                onClick={() => scrollTo(ctxRef)}
                style={{
                  background: "#238636",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  padding: "0.75rem 1.75rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#2ea043";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#238636";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Start Chatting →
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "1px solid #30363d",
                  borderRadius: 10,
                  color: "#e6edf3",
                  padding: "0.75rem 1.75rem",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "border-color 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#8b949e";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#30363d";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Login
              </button>
            </div>

            {/* Stat row */}
            <div
              className="fade-up fade-up-4"
              style={{
                display: "flex",
                gap: "2rem",
                marginTop: "2.5rem",
                borderTop: "1px solid #21262d",
                paddingTop: "1.75rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { n: "7", label: "AI Contexts" },
                { n: "∞", label: "Conversations" },
                { n: "🔊", label: "Voice Replies" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="hb-display"
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "#e6edf3",
                    }}
                  >
                    {s.n}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#8b949e",
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Chat preview card */}
          <div
            className="fade-up fade-up-3 hero-preview"
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Fake header */}
            <div
              style={{
                background: "#0d1117",
                borderBottom: "1px solid #21262d",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
              <span
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#8b949e",
                }}
              >
                ContextBot — Coding Assistant
              </span>
            </div>
            {/* Fake messages */}
            <div
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                { role: "user", text: "Why is my useEffect running twice?" },
                {
                  role: "assistant",
                  text: "In React 18, StrictMode intentionally mounts components twice in development to help catch side effects. Your effect is fine — it's just the dev double-invoke. It won't happen in production.",
                },
                {
                  role: "user",
                  text: "How do I fix it without disabling StrictMode?",
                },
                {
                  role: "assistant",
                  text: "Use a cleanup function and an ignore flag:\n\nuseEffect(() => {\n  let ignore = false;\n  fetchData().then(d => { if (!ignore) setData(d); });\n  return () => { ignore = true; };\n}, []);",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      background: m.role === "user" ? "#238636" : "#0d1117",
                      color: "#e6edf3",
                      borderRadius:
                        m.role === "user"
                          ? "12px 12px 4px 12px"
                          : "12px 12px 12px 4px",
                      padding: "0.6rem 0.85rem",
                      fontSize: "0.78rem",
                      lineHeight: 1.55,
                      border:
                        m.role === "assistant" ? "1px solid #21262d" : "none",
                      whiteSpace: "pre-wrap",
                      fontFamily: m.text.includes("\n")
                        ? "monospace"
                        : "inherit",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Fake input */}
            <div
              style={{
                borderTop: "1px solid #21262d",
                padding: "0.75rem 1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#0d1117",
                  border: "1px solid #60a5fa44",
                  borderRadius: 8,
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.78rem",
                  color: "#484f58",
                }}
              >
                Ask your coding assistant...
              </div>
              <div
                style={{
                  background: "#60a5fa",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                }}
              >
                ➤
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section
          ref={featRef}
          id="features"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                color: "#8b949e",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Built different
            </p>
            <h2
              className="hb-display"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#e6edf3",
              }}
            >
              Everything you need, nothing you don't.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feat-card"
                style={{
                  background: "#161b22",
                  border: `1px solid #21262d`,
                  borderRadius: 14,
                  padding: "1.5rem",
                  animationDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = f.accent + "66")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#21262d")
                }
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: f.accent + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    marginBottom: "1rem",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#e6edf3",
                    marginBottom: "0.4rem",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#8b949e",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                color: "#8b949e",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              How it works
            </p>

            <h2
              className="hb-display"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#e6edf3",
                marginBottom: "0.75rem",
              }}
            >
              Experience ContextBot in four simple steps.
            </h2>

            <p
              style={{
                color: "#8b949e",
                fontSize: "0.95rem",
              }}
            >
              Choose the right AI, chat naturally, hear voice responses and save
              your conversations.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              {
                icon: "🎯",
                title: "Choose Context",
                desc: "Select one of seven AI assistants tailored for different conversations.",
                accent: "#238636",
              },
              {
                icon: "💬",
                title: "Start Chatting",
                desc: "Ask naturally and receive intelligent responses instantly.",
                accent: "#60a5fa",
              },
              {
                icon: "🔊",
                title: "Hear Voice Replies",
                desc: "Each assistant responds using its own Murf AI voice.",
                accent: "#fbbf24",
              },
              {
                icon: "🗂",
                title: "Save Conversations",
                desc: "Login to save chat history and continue anytime.",
                accent: "#ff5c93",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="feat-card"
                style={{
                  background: "#161b22",
                  border: "1px solid #21262d",
                  borderRadius: 14,
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = step.accent + "66")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#21262d")
                }
              >
                <div
                  style={{
                    position: "absolute",
                    top: 15,
                    right: 18,
                    fontSize: "2rem",
                    color: "#30363d",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: step.accent + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    marginBottom: "1rem",
                  }}
                >
                  {step.icon}
                </div>

                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#e6edf3",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#8b949e",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTEXTS ── */}
        <section
          ref={ctxRef}
          id="contexts"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                color: "#8b949e",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Pick your assistant
            </p>
            <h2
              className="hb-display"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#e6edf3",
                marginBottom: "0.75rem",
              }}
            >
              Seven minds. One app.
            </h2>
            <p style={{ color: "#8b949e", fontSize: "0.95rem" }}>
              Click any card to try it instantly — no account needed.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {CONTEXTS.map((ctx) => (
              <div
                key={ctx.id}
                className="ctx-card"
                onClick={() => openGuestContext(ctx)}
                style={{
                  background: "#161b22",
                  border: `1px solid #21262d`,
                  borderRadius: 14,
                  padding: "1.5rem 1.25rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ctx.accent + "88";
                  e.currentTarget.style.boxShadow = `0 8px 28px ${ctx.accent}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#21262d";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: ctx.accent + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    marginBottom: "0.9rem",
                  }}
                >
                  {ctx.label.split(" ")[0]}
                </div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: ctx.accent,
                    marginBottom: "0.35rem",
                  }}
                >
                  {ctx.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#8b949e",
                    lineHeight: 1.55,
                  }}
                >
                  {ctx.desc}
                </p>
                <div
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: ctx.accent,
                    opacity: 0.8,
                  }}
                >
                  Try it free →
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GUEST CHAT ── */}
        {guestContext && (
          <section
            ref={guestChatRef}
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 900,
              margin: "0 auto",
              padding: "2rem 1.5rem 4rem",
            }}
          >
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#8b949e",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  }}
                >
                  Guest Mode
                </span>
                <h3
                  className="hb-display"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#e6edf3",
                    marginTop: 2,
                  }}
                >
                  {guestContext.label} Assistant
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {/* Countdown pill */}
                <div
                  style={{
                    background:
                      guestRemaining > 2 ? "#238636" + "22" : "#ff5c93" + "22",
                    border: `1px solid ${guestRemaining > 2 ? "#238636" : "#ff5c93"}44`,
                    borderRadius: 20,
                    padding: "0.3rem 0.9rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: guestRemaining > 2 ? "#34d399" : "#ff5c93",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>💬</span>
                  <span>
                    {guestRemaining} message{guestRemaining !== 1 ? "s" : ""}{" "}
                    remaining
                  </span>
                </div>

                <button
                  onClick={closeGuestChat}
                  style={{
                    background: "none",
                    border: "1px solid #30363d",
                    borderRadius: 8,
                    color: "#8b949e",
                    padding: "0.3rem 0.7rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#e6edf3")}
                  onMouseLeave={(e) => (e.target.style.color = "#8b949e")}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Chat window */}
            <div
              style={{
                background: "#161b22",
                border: `1px solid ${guestContext.accent}44`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: `0 0 40px ${guestContext.accent}18`,
                position: "relative",
              }}
            >
              {/* Chat header bar */}
              <div
                style={{
                  background: "#0d1117",
                  borderBottom: "1px solid #21262d",
                  padding: "0.65rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: guestContext.accent,
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "#8b949e" }}>
                  {guestContext.name} Assistant — Guest Session
                </span>
              </div>

              {/* Messages */}
              <div
                className="guest-chat-area"
                style={{
                  minHeight: 320,
                  maxHeight: 440,
                  overflowY: "auto",
                  padding: "1.25rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {guestMessages.length === 0 && (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}
                      >
                        {guestContext.label.split(" ")[0]}
                      </div>
                      <p style={{ color: "#8b949e", fontSize: "0.9rem" }}>
                        Say something to get started.
                      </p>
                    </div>
                  </div>
                )}

                {guestMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        background:
                          msg.role === "user" ? guestContext.accent : "#0d1117",
                        color: "#e6edf3",
                        borderRadius:
                          msg.role === "user"
                            ? "14px 14px 4px 14px"
                            : "14px 14px 14px 4px",
                        padding: "0.65rem 0.9rem",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        border:
                          msg.role === "assistant"
                            ? "1px solid #21262d"
                            : "none",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {guestLoading && (
                  <div style={{ display: "flex", gap: 5, paddingLeft: 4 }}>
                    <span
                      className="dot"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: guestContext.accent,
                        display: "inline-block",
                      }}
                    />
                    <span
                      className="dot"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: guestContext.accent,
                        display: "inline-block",
                      }}
                    />
                    <span
                      className="dot"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: guestContext.accent,
                        display: "inline-block",
                      }}
                    />
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  borderTop: "1px solid #21262d",
                  padding: "0.85rem 1rem",
                  display: "flex",
                  gap: "0.6rem",
                  background: "#0d1117",
                }}
              >
                <input
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyDown={handleGuestKeyDown}
                  disabled={guestRemaining <= 0 || guestLoading}
                  placeholder={
                    guestRemaining <= 0
                      ? "Create an account to continue..."
                      : `Ask the ${guestContext.name.toLowerCase()} assistant...`
                  }
                  style={{
                    flex: 1,
                    background: "#161b22",
                    border: `1px solid ${guestContext.accent}44`,
                    borderRadius: 10,
                    padding: "0.6rem 1rem",
                    color: "#e6edf3",
                    fontSize: "0.875rem",
                    outline: "none",
                    opacity: guestRemaining <= 0 ? 0.5 : 1,
                  }}
                />
                <button
                  onClick={sendGuestMessage}
                  disabled={
                    guestRemaining <= 0 || guestLoading || !guestInput.trim()
                  }
                  style={{
                    background: guestContext.accent,
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    padding: "0.6rem 1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity:
                      guestRemaining <= 0 || guestLoading || !guestInput.trim()
                        ? 0.5
                        : 1,
                    transition: "opacity 0.15s",
                    fontSize: "1rem",
                  }}
                >
                  ➤
                </button>
              </div>

              {/* Blur overlay + modal when limit hit */}
              {showModal && (
                <div className="blur-overlay">
                  <div
                    style={{
                      background: "#161b22",
                      border: "1px solid #30363d",
                      borderRadius: 16,
                      padding: "2rem",
                      maxWidth: 380,
                      width: "100%",
                      margin: "0 1rem",
                      textAlign: "center",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div
                      style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}
                    >
                      🔓
                    </div>
                    <h3
                      className="hb-display"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#e6edf3",
                        marginBottom: "0.6rem",
                      }}
                    >
                      Continue Your Conversation
                    </h3>
                    <p
                      style={{
                        color: "#8b949e",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        marginBottom: "1.5rem",
                      }}
                    >
                      Create a free account to save chats, unlock unlimited
                      conversations, and access all AI assistants.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => navigate("/login")}
                        style={{
                          background: "none",
                          border: "1px solid #30363d",
                          borderRadius: 8,
                          color: "#e6edf3",
                          padding: "0.6rem 1.25rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.borderColor = "#8b949e")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.borderColor = "#30363d")
                        }
                      >
                        Login
                      </button>
                      <button
                        onClick={() => navigate("/signup")}
                        style={{
                          background: "#238636",
                          border: "none",
                          borderRadius: 8,
                          color: "#fff",
                          padding: "0.6rem 1.25rem",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#2ea043")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#238636")
                        }
                      >
                        Sign Up Free
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sign-up nudge below chat */}
            {!showModal && guestRemaining <= 2 && guestRemaining > 0 && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  fontSize: "0.82rem",
                  color: "#8b949e",
                }}
              >
                Running low.{" "}
                <span
                  onClick={() => navigate("/signup")}
                  style={{
                    color: "#34d399",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Create a free account
                </span>{" "}
                for unlimited access.
              </p>
            )}
          </section>
        )}

        {/* ── CTA BANNER ── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "2rem 1.5rem 5rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
              border: "1px solid #30363d",
              borderRadius: 20,
              padding: "3rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(ellipse at 50% 0%, #23863618 0%, transparent 70%)",
              }}
            />

            <h2
              className="hb-display"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#e6edf3",
                marginBottom: "0.75rem",
              }}
            >
              Ready to find your AI?
            </h2>
            <p
              style={{
                color: "#8b949e",
                fontSize: "0.95rem",
                marginBottom: "1.75rem",
              }}
            >
              Sign up free. No credit card. Start in 30 seconds.
            </p>
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: "#238636",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                padding: "0.8rem 2rem",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#2ea043";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#238636";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Create Free Account →
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "1px solid #21262d",
            padding: "2rem 1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ fontSize: "1.1rem" }}>🤖</span>
              <span
                className="hb-display"
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#8b949e",
                }}
              >
                ContextBot
              </span>
              <span
                style={{
                  color: "#30363d",
                  marginLeft: "0.5rem",
                  fontSize: "0.75rem",
                }}
              >
                v1.0
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <a href="#" className="nav-link" style={{ fontSize: "0.82rem" }}>
                About
              </a>

              <a
                href="https://github.com/Praveenraj2206"
                target="_blank"
                rel="noreferrer"
                className="nav-link"
                style={{ fontSize: "0.82rem" }}
              >
                GitHub
              </a>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.2,
                }}
              >
                <span
                  style={{
                    color: "#8b949e",
                    fontSize: "0.72rem",
                  }}
                >
                  Developed by
                </span>

                <span
                  style={{
                    color: "#e6edf3",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                  }}
                >
                  Praveen Raj S
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "#484f58" }}>
              Built with ❤️ using React + Vite
            </p>
          </div>
        </footer>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; padding-top: 2.5rem !important; }
          .hero-preview { display: none; }
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}