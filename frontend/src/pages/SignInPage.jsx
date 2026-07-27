import { motion } from 'framer-motion'
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
    <main className="grid min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 lg:grid-cols-[1fr_1fr]">
      <section className="relative flex items-center justify-center px-4 py-10 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          <motion.div variants={itemVariants}>
            <BrandMark />
          </motion.div>
          <div className="mt-12">
            <motion.p variants={itemVariants} className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Welcome back
            </motion.p>
            <motion.h1 variants={itemVariants} className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              Sign in to continue
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-3 text-base leading-relaxed text-slate-600">
              Open your analyzer workspace and continue turning board photos into notes.
            </motion.p>
          </div>
          <motion.form variants={itemVariants} onSubmit={submit} className="mt-10 space-y-5">
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
                placeholder="Minimum 6 characters"
              />
            </label>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-slate-800 hover:shadow-slate-900/30"
            >
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </motion.form>
          <motion.p variants={itemVariants} className="mt-8 text-center text-sm font-medium text-slate-600">
            New here?{' '}
            <Link to="/sign-up" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              Create an account
            </Link>
          </motion.p>
        </motion.div>
      </section>
      
      <section className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.15),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.1),transparent_40%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl shadow-2xl">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
              Study dashboard
            </p>
            <h2 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white">
              Your notes, code, and flashcards stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">one click away.</span>
            </h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid gap-4 mt-12"
          >
            {['Upload board', 'Review markdown', 'Practice cards'].map(
              (item, index) => (
                <motion.div 
                  variants={itemVariants}
                  key={item} 
                  className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/10 transition-all hover:bg-white/10 hover:scale-[1.02]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-base font-bold text-slate-950 shadow-md group-hover:bg-emerald-400 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-lg font-semibold text-slate-200">{item}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
