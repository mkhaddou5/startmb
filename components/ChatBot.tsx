'use client'

import { useState } from 'react'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Error getting response.' }])
    }

    setLoading(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shadow-md text-xl"
      >
        💬
      </button>

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col mt-2 border">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl font-semibold">
            📄 StartMB AI Bot
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm">Typing...</div>}
          </div>
          <div className="p-2 border-t flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about documents..."
              className="flex-1 border px-2 py-1 rounded text-sm"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  )
}
