import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Track your mood, try exercises, and chat with counselors.</p>
      <div className="grid cols-3" style={{ marginTop: 24 }}>
        <Link to="/mood" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Mood Tracker</h3>
          <p>Log your mood and view trends.</p>
        </Link>
        <Link to="/exercises" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Exercises</h3>
          <p>Guided meditation, breathing, and CBT tasks.</p>
        </Link>
        <Link to="/chat" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Chat</h3>
          <p>Real-time counseling chat.</p>
        </Link>
      </div>
    </div>
  )
}
