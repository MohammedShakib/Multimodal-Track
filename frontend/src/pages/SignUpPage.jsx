import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import BrandMark from '../components/BrandMark.jsx'
import useAuth from '../context/useAuth.js'
import { Link } from '../lib/router.jsx'
import { useNavigate } from '../lib/routerHooks.js'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      toast.error('Enter your full name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    signUp({ name: form.name, email: form.email })
    toast.success('Account created')
    navigate('/home')
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[0.9fr_1fr]">
      <section className="hidden bg-[linear-gradient(135deg,#022c22_0%,#0f172a_52%,#020617_100%)] p-8 text-white lg:block">
        <div className="flex h-full flex-col justify-between border border-white/10 bg-white/5 p-8">
          <BrandMark dark />
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">
              Start faster
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Build a reusable study kit from every classroom board.
            </h2>
          </div>
          <div className="grid grid-cols-3 border border-white/10">
            <div className="p-4">
              <div className="text-2xl font-semibold">3</div>
              <div className="mt-1 text-xs text-slate-400">Output views</div>
            </div>
            <div className="border-x border-white/10 p-4">
              <div className="text-2xl font-semibold">8MB</div>
              <div className="mt-1 text-xs text-slate-400">Image max</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-semibold">AI</div>
              <div className="mt-1 text-xs text-slate-400">Vision model</div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <BrandMark />
          </div>
          <div className="mt-10 lg:mt-0">
            <p className="text-sm font-semibold uppercase text-emerald-700">
              Create account
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">
              Start your study workspace
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Mock auth is enabled for the prototype. Backend auth structure can be added next.
            </p>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Full name
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-sky-500"
                placeholder="Your name"
              />
            </label>
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
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                Confirm password
              </span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
                className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-sky-500"
                placeholder="Repeat password"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 bg-emerald-500 px-5 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-200 hover:bg-emerald-400"
            >
              Create account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/sign-in" className="font-semibold text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
