import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import useAuth from './context/useAuth.js'
import { RouterProvider } from './lib/router.jsx'
import { useNavigate, usePathname } from './lib/routerHooks.js'
import HomePage from './pages/HomePage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

function RouteView() {
  const { user } = useAuth()
  const pathname = usePathname()
  const navigate = useNavigate()

  if (pathname === '/home') {
    if (!user) {
      queueMicrotask(() => navigate('/sign-in', { replace: true }))
      return null
    }
    return <HomePage />
  }

  if (pathname === '/sign-in') return <SignInPage />
  if (pathname === '/sign-up') return <SignUpPage />
  if (pathname === '/') return <LandingPage />

  queueMicrotask(() => navigate('/', { replace: true }))
  return null
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Toaster position="top-right" />
        <RouteView />
      </RouterProvider>
    </AuthProvider>
  )
}

export default App
