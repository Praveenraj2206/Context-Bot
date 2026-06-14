import React from "react";

const CONTEXTS = [
  { key: "generic", label: "General", emoji: "💬" },
  { key: "love", label: "Love", emoji: "❤️" },
  { key: "mentor", label: "Mentor", emoji: "🎓" },
  { key: "environment", label: "Environment", emoji: "🌱" },
  { key: "robotics", label: "Robotics", emoji: "🤖" },
  { key: "math", label: "Math", emoji: "🧮" },
  { key: "coding", label: "Coding", emoji: "💻" },
];

export default function ContextSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-2 px-4 py-3 bg-brand-card border-b border-slate-800 overflow-x-auto">
      {CONTEXTS.map((context) => (
        <button
          key={context.key}
          onClick={() => onSelect(context.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all
          ${
            selected === context.key
              ? "bg-brand-accent text-white"
              : "bg-brand-dark text-slate-400 hover:text-white"
          }`}
        >
          <span>{context.emoji}</span>
          <span>{context.label}</span>
        </button>
      ))}
    </div>
  );
}
