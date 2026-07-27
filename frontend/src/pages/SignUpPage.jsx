import { motion } from 'framer-motion'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <main className="grid min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 lg:grid-cols-[1fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.1),transparent_50%)]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl shadow-2xl"
        >
          <BrandMark dark />
          <div className="mt-20 flex-1">
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300"
            >
              Start faster
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white"
            >
              Build a reusable study kit from <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">every classroom board.</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md overflow-hidden"
          >
            <div className="p-6 text-center transition-colors hover:bg-white/5">
              <div className="text-3xl font-bold text-emerald-400">3</div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">Output views</div>
            </div>
            <div className="p-6 text-center transition-colors hover:bg-white/5">
              <div className="text-3xl font-bold text-sky-400">8MB</div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">Image max</div>
            </div>
            <div className="p-6 text-center transition-colors hover:bg-white/5">
              <div className="text-3xl font-bold text-amber-400">AI</div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">Vision model</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative flex items-center justify-center px-4 py-10 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="lg:hidden mb-10">
            <BrandMark />
          </motion.div>
          <div>
            <motion.p variants={itemVariants} className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Create account
            </motion.p>
            <motion.h1 variants={itemVariants} className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              Start your workspace
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-3 text-base leading-relaxed text-slate-600">
              Mock auth is enabled for the prototype. Backend auth structure can be added next.
            </motion.p>
          </div>
          <motion.form variants={itemVariants} onSubmit={submit} className="mt-10 space-y-5">
            <label className="block group">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Full name
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                placeholder="Your name"
              />
            </label>
            <label className="block group">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                placeholder="you@example.com"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block group">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  Password
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="Min 6 chars"
                />
              </label>
              <label className="block group">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  Confirm
                </span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm({ ...form, confirmPassword: event.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="Repeat"
                />
              </label>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-slate-950 shadow-lg transition-colors hover:bg-emerald-400 hover:shadow-emerald-500/30"
            >
              Create account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </motion.form>
          <motion.p variants={itemVariants} className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account?{' '}
            <Link to="/sign-in" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </main>
  )
}
