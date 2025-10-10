import { useEffect, useState } from 'react'
import api from '../utils/api'

const CATALOG = [
  { key: 'meditation_5', title: '5-min Meditation', desc: 'Clear your mind and find focus.' },
  { key: 'breathing_box', title: 'Box Breathing', desc: 'Regulate your nervous system.' },
  { key: 'cbt_thought_record', title: 'CBT Thought Record', desc: 'Challenge negative thoughts.' },
]

export default function Exercises() {
  const [progress, setProgress] = useState({})
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await api.get('/api/exercises/progress')
      setProgress(res || {})
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markDone = async (key) => {
    try {
      await api.post('/api/exercises/complete', { key })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Exercises</h2>
      <p>Guided activities to improve your mental well-being.</p>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 16 }}>
        {CATALOG.map((item) => (
          <li key={item.key} className="card">
            <div className="row">
              <div style={{ flex: 1 }}>
                <strong>{item.title}</strong>
                <p style={{ margin: '4px 0 0' }}>{item.desc}</p>
              </div>
              <div className="chip">
                Completed: {progress[item.key] || 0}
              </div>
              <button onClick={() => markDone(item.key)} className="btn">Mark Complete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
