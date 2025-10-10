const api = {
  async request(path, options = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    }
    const res = await fetch(path, { ...options, headers })
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    if (!res.ok) {
      let message = res.statusText
      try {
        const payload = isJson ? await res.json() : await res.text()
        if (isJson && payload && (payload.error || payload.message)) {
          message = payload.error || payload.message
        } else if (typeof payload === 'string' && payload.trim()) {
          message = payload
        }
      } catch {
        // ignore parse errors, fallback to statusText
      }
      throw new Error(message)
    }
    return isJson ? res.json() : res.text()
  },
  get(path) {
    return this.request(path)
  },
  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) })
  },
  put(path, body) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) })
  },
  delete(path) {
    return this.request(path, { method: 'DELETE' })
  },
}

export default api
