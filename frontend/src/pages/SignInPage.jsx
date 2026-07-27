import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import BrandMark from '../components/BrandMark.jsx'
import useAuth from '../context/useAuth.js'
import { Link } from '../lib/router.jsx'
import { useNavigate } from '../lib/routerHooks.js'

export default function SignInPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const submit = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    signIn({ email: form.email })
    toast.success('Signed in')
    navigate('/home')
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-md">
          <BrandMark />
          <div className="mt-12">
            <p className="text-sm font-semibold uppercase text-emerald-700">
              Welcome back
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">
              Sign in to continue
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Open your analyzer workspace and continue turning board photos into notes.
            </p>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-sky-500"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                Password
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-sky-500"
                placeholder="Minimum 6 characters"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white shadow-xl shadow-slate-300 hover:bg-slate-800"
            >
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            New here?{' '}
            <Link to="/sign-up" className="font-semibold text-emerald-700">
              Create an account
            </Link>
          </p>
        </div>
      </section>
      <section className="hidden bg-slate-950 p-8 text-white lg:block">
        <div className="flex h-full flex-col justify-between border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">
              Study dashboard
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Your notes, code, and flashcards stay one click away.
            </h2>
          </div>
          <div className="grid gap-3">
            {['Upload board', 'Review markdown', 'Practice cards'].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3 bg-white/10 p-4">
                  <span className="flex h-9 w-9 items-center justify-center bg-white text-sm font-semibold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
