import { useState } from 'react'

export default function InputBar({ onSend, isLoading }) {
  const [text, setText] = useState('')

  function handleSubmit() {
    if (!text.trim() || isLoading) return
    onSend(text.trim())
    setText('')
  }

  function handleKeyDown(e) {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-end gap-3 p-4 border-t border-ink-700">
      <textarea
        className="input-field resize-none min-h-[48px] max-h-[120px] leading-relaxed"
        placeholder="How are you feeling today..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="btn-primary h-12 w-12 flex items-center justify-center rounded-xl flex-shrink-0 p-0"
      >
        {isLoading ? (
          /* Loading spinner */
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          /* Send icon */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </div>
  )
}
