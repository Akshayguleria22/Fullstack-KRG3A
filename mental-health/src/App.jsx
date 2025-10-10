import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MoodTracker from './pages/MoodTracker'
import Exercises from './pages/Exercises'
import Chat from './pages/Chat'
import useAuth from './state/useAuth'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function AppShell({ children }) {
  const { token, logout } = useAuth()
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            Mind<span className="brand-accent">Well</span>
          </div>
          <nav className="navlinks">
            <NavLink to="/" className="navlink">Dashboard</NavLink>
            <NavLink to="/mood" className="navlink">Mood</NavLink>
            <NavLink to="/exercises" className="navlink">Exercises</NavLink>
            <NavLink to="/chat" className="navlink">Chat</NavLink>
          </nav>
          <div style={{ marginLeft: 'auto' }}>
            {token ? (
              <button onClick={logout} className="btn ghost">Logout</button>
            ) : (
              <NavLink to="/login" className="btn">Login</NavLink>
            )}
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </AppShell>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
