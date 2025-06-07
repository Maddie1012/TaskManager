import { useState, useEffect } from 'react'
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'
import { load, save, USERS_KEY, CURRENT_USER_KEY } from './storage.js'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userId = load(CURRENT_USER_KEY, null)
    if (userId) {
      const users = load(USERS_KEY, [])
      const existing = users.find(u => u.id === userId)
      if (existing) setUser(existing)
    }
  }, [])

  function handleAuth(u) {
    setUser(u)
  }

  function handleLogout() {
    setUser(null)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center'
    }}>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuth={handleAuth} />
      )}
    </div>
  )
}