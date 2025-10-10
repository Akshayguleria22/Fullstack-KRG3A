import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../state/useAuth'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await register(form)
      } else {
        await login(form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '64px auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center' }}>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 16 }}>
          {isRegister && (
            <div className="field">
              <label>Name</label>
              <input
                className="input"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          <button type="submit" className="btn">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
      <button onClick={() => setIsRegister((v) => !v)} className="btn ghost" style={{ width: '100%', marginTop: 16 }}>
        {isRegister ? 'Have an account? Login' : 'New here? Register'}
      </button>
    </div>
  )
}
