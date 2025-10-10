import { useEffect, useRef, useState } from 'react'
import { encryptMessage, decryptMessage } from '../utils/crypto'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const wsRef = useRef(null)
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/chat?token=${token}`)
    wsRef.current = ws
    ws.onmessage = async (evt) => {
      try {
        const payload = JSON.parse(evt.data)
        const text = await decryptMessage(payload.cipher)
        setMessages((prev) => [...prev, { from: payload.from, text, at: new Date() }])
      } catch {
        // ignore
      }
    }
    ws.onclose = () => {
      wsRef.current = null
    }
    return () => ws.close()
  }, [])

  const send = async () => {
    if (!input.trim() || !wsRef.current) return
    const cipher = await encryptMessage(input.trim())
    wsRef.current.send(JSON.stringify({ cipher }))
    setMessages((prev) => [...prev, { from: 'me', text: input.trim(), at: new Date() }])
    setInput('')
  }

  return (
    <div className="card chat">
      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ textAlign: m.from === 'me' ? 'right' : 'left' }}>
            <div className={`bubble ${m.from === 'me' ? 'me' : 'other'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="btn">Send</button>
      </div>
    </div>
  )
}
