import React from "react";

const CONTEXT_COLORS = {
  generic: "#238636",
  love: "#ff5c93",
  mentor: "#facc15",
  coding: "#60a5fa",
  math: "#fbbf24",
  robotics: "#22d3ee",
  environment: "#34d399",
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const accent = CONTEXT_COLORS[message.context] || CONTEXT_COLORS.generic;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={
          isUser
            ? {
                backgroundColor: accent,
                color: "#fff",
                borderBottomRightRadius: "6px",
              }
            : {
                backgroundColor: "#161b22",
                color: "#c9d1d9",
                border: "1px solid #30363d",
                borderBottomLeftRadius: "6px",
              }
        }
      >
        {message.content}
      </div>
    </div>
  );
}
