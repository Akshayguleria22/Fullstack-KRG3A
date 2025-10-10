import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api'

import AuthContext from './authContextOnly'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (payload) => {
    const res = await api.post('/api/auth/register', payload)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    setToken('')
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
