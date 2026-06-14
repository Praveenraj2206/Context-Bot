import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
        <div className="text-5xl animate-pulse-soft">🌊</div>
        <p className="font-display font-semibold text-slate-300 text-lg">
          How are you feeling right now?
        </p>
        <p className="text-slate-500 text-sm font-body max-w-xs">
          I'll detect your mood and respond with empathy. Start by telling me anything.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
