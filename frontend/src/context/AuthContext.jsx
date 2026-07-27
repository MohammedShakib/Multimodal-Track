import { useMemo, useState } from 'react'
import AuthContext from './authContext.js'

const AUTH_KEY = 'multimodal-track-user'
const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://multimodal-track-backend.onrender.com/api/v1'

const SUPER_ADMIN_USERNAME = 'sadmin'
const SUPER_ADMIN_PASSWORD = 'sadmin'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
  } catch {
    return null
  }
}

function registerAppUser(user) {
  if (!user?.email || user.isSuperAdmin) return

  fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
    }),
  }).catch(() => {
    // Auth is local-only for this prototype; DB registration is best-effort.
  })
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const value = useMemo(
    () => ({
      user,
      signIn: ({ email, password }) => {
        // Super admin check: username:sadmin / password:sadmin
        if (email === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
          const adminUser = {
            name: 'Super Admin',
            email: 'sadmin',
            isSuperAdmin: true,
          }
          localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser))
          setUser(adminUser)
          return { isSuperAdmin: true }
        }

        const nextUser = {
          name: email.split('@')[0] || 'Student',
          email,
          isSuperAdmin: false,
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
        registerAppUser(nextUser)
        return { isSuperAdmin: false }
      },
      signUp: ({ name, email }) => {
        const nextUser = {
          name: name.trim() || email.split('@')[0] || 'Student',
          email,
          isSuperAdmin: false,
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
        registerAppUser(nextUser)
      },
      logout: () => {
        localStorage.removeItem(AUTH_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
