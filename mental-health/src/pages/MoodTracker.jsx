import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function MoodTracker() {
  const [score, setScore] = useState(5)
  const [note, setNote] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await api.get('/api/moods')
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/moods', { score: Number(score), note })
      setNote('')
      fetchItems()
    } catch (e) {
      setError(e.message)
    }
  }

  const chartData = useMemo(
    () =>
      (items || []).map((i) => ({
        date: new Date(i.createdAt || i.date || Date.now()).toLocaleDateString(),
        score: i.score,
      })),
    [items]
  )

  return (
    <div className="grid cols-2">
      <div className="card">
        <h2>Log your mood</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 16 }}>
          <div className="field">
            <label>How are you feeling? (1-10)</label>
            <input className="input" type="number" min={1} max={10} value={score} onChange={(e) => setScore(e.target.value)} />
          </div>
          <div className="field">
            <label>Journal note (optional)</label>
            <textarea className="input" placeholder="What's on your mind?" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button type="submit" className="btn">Log</button>
        </form>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
      <div className="card chart-card">
        <div className="chart-header">
          <h3>Mood Trends</h3>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', padding: 24 }}>Loading…</p>
        ) : (
          <div className="chart-body">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} />
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="var(--muted)" />
                <YAxis domain={[0, 10]} stroke="var(--muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elev)', border: '1px solid var(--border)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h3>History</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {(items || []).slice().reverse().map((i) => (
            <li key={i.id || i._id} className="row" style={{ borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
              <strong style={{ color: 'var(--primary)' }}>{i.score}/10</strong>
              <span style={{ flex: 1 }}>{i.note || '-'}</span>
              <em className="muted">{new Date(i.createdAt || i.date).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
