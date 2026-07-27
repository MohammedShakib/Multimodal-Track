import { useMemo, useState } from 'react'
import AuthContext from './authContext.js'

const AUTH_KEY = 'multimodal-track-user'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const value = useMemo(
    () => ({
      user,
      signIn: ({ email }) => {
        const nextUser = {
          name: email.split('@')[0] || 'Student',
          email,
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
      },
      signUp: ({ name, email }) => {
        const nextUser = {
          name: name.trim() || email.split('@')[0] || 'Student',
          email,
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
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
