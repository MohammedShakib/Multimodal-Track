import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthContext from './authContext.js'

const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://multimodal-track-backend.onrender.com/api/v1'

async function authFetch(path, options = {}) {
  const response = await fetch(`${API_URL}/auth${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Authentication failed.')
  }

  return payload
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let active = true

    authFetch('/me')
      .then((payload) => {
        if (active) setUser(payload.user || null)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setAuthLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const payload = await authFetch('/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(payload.user)
    return payload.user
  }, [])

  const signUp = useCallback(async ({ name, email, password }) => {
    const payload = await authFetch('/sign-up', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    setUser(payload.user)
    return payload.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authFetch('/logout', { method: 'POST' })
    } catch {
      /* Sign-out should clear the UI even if the request fails. */
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      signIn,
      signUp,
      logout,
    }),
    [authLoading, logout, signIn, signUp, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
