import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import useAuth from './context/useAuth.js'
import { RouterProvider } from './lib/router.jsx'
import { useNavigate, usePathname } from './lib/routerHooks.js'
import HomePage from './pages/HomePage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import SuperAdminPage from './pages/SuperAdminPage.jsx'

function RouteView() {
  const { user, authLoading } = useAuth()
  const pathname = usePathname()
  const navigate = useNavigate()

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500">
        Loading...
      </main>
    )
  }

  if (pathname === '/home') {
    if (!user) {
      queueMicrotask(() => navigate('/sign-in', { replace: true }))
      return null
    }
    return <HomePage />
  }

  if (pathname === '/super-admin') {
    if (!user?.isSuperAdmin) {
      queueMicrotask(() => navigate('/sign-in', { replace: true }))
      return null
    }
    return <SuperAdminPage />
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
