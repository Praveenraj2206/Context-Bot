import React, { useState } from "react";
import api from "../utils/api";

const CONTEXT_COLORS = {
  generic: "#238636",
  love: "#ff5c93",
  mentor: "#facc15",
  coding: "#60a5fa",
  math: "#fbbf24",
  robotics: "#22d3ee",
  environment: "#34d399",
};

// Global audio player
let currentAudio = null;
let currentSetter = null;

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const [loadingVoice, setLoadingVoice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const accent = CONTEXT_COLORS[message.context] || CONTEXT_COLORS.generic;

  const playVoice = async () => {
    // Stop current audio if THIS message is already playing
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;

      setIsPlaying(false);

      currentAudio = null;
      currentSetter = null;

      return;
    }

    // Stop any other message that's playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;

      if (currentSetter) currentSetter(false);
    }

    try {
      setLoadingVoice(true);

      const res = await api.post("/tts", {
        text: message.content,
        context: message.context,
      });

      const audio = new Audio(res.data.audio_url);

      currentAudio = audio;
      currentSetter = setIsPlaying;

      setIsPlaying(true);

      audio.play();

      audio.onended = () => {
        setIsPlaying(false);

        currentAudio = null;
        currentSetter = null;
      };
    } catch (err) {
      console.error("Voice Error:", err);
      alert("Unable to generate voice.");
    } finally {
      setLoadingVoice(false);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
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
        <div>{message.content}</div>

        {!isUser && (
          <div className="flex justify-end mt-3">
            <button
              onClick={playVoice}
              disabled={loadingVoice}
              title="Play Voice"
              className="text-lg hover:scale-110 transition-transform disabled:opacity-50"
            >
              {loadingVoice ? "⏳" : isPlaying ? "⏹" : "🔊"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
