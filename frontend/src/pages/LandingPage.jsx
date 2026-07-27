import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Code2,
  FileText,
  Layers,
  ScanLine,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import { motion } from 'framer-motion'
import logoMarkUrl from '../assets/logo-mark.png'
import { Link } from '../lib/router.jsx'

const features = [
  {
    title: 'Bangla + English board parsing',
    detail: 'Mixed handwriting, arrows, keywords, and topic clusters ke structured output-e convert kore.',
    icon: ScanLine,
  },
  {
    title: 'Markdown study summary',
    detail: 'Headings, bullets, and highlighted terms ready hoy class note ba revision-er jonno.',
    icon: FileText,
  },
  {
    title: 'Code extraction',
    detail: 'Pseudocode, formulas, and code-like blocks syntax highlighted snippet hisebe render hoy.',
    icon: Code2,
  },
  {
    title: 'Interactive flashcards',
    detail: 'Whiteboard topic theke Q&A cards generate hoy quick recall practice-er jonno.',
    icon: Layers,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

function PreviewPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="relative mx-auto w-full max-w-xl rounded-3xl border border-white/20 bg-white/5 p-4 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Capture
            </span>
            <Camera className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl aspect-[4/3] border border-dashed border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 p-4 relative">
            <motion.div 
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.4)_0,transparent_50%)]"
            />
            <div className="relative z-10">
              <div className="h-2 w-24 rounded-full bg-slate-600" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <motion.div whileHover={{ scale: 1.05 }} className="h-14 rounded-lg bg-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                <motion.div whileHover={{ scale: 1.05 }} className="h-20 rounded-lg bg-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.3)]" />
                <motion.div whileHover={{ scale: 1.05 }} className="h-12 rounded-lg bg-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-2 w-full rounded-full bg-slate-500" />
                <div className="h-2 w-3/4 rounded-full bg-slate-600" />
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Analyze board
          </motion.button>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/95 p-4 text-slate-900 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Summary
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-slate-800" />
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-slate-200" />
                <div className="h-2 w-11/12 rounded-full bg-slate-200" />
                <div className="h-2 w-2/3 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-white shadow-lg backdrop-blur-md">
              <Code2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              <div className="mt-5 h-2 w-20 rounded-full bg-emerald-400/50" />
              <div className="mt-2 h-2 w-14 rounded-full bg-emerald-400/30" />
            </div>
            <div className="rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-100 to-amber-50 p-4 text-slate-950 shadow-lg">
              <Layers className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <div className="mt-3 text-3xl font-bold tracking-tight text-amber-950">12</div>
              <div className="text-xs font-medium text-amber-700/80">Flashcards</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function HeroLogoMark() {
  return (
    <motion.div
      variants={itemVariants}
      className="h-16 w-16 shrink-0 md:h-20 md:w-20"
      aria-hidden="true"
    >
      <img
        src={logoMarkUrl}
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_0_28px_rgba(14,165,233,0.35)]"
      />
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(45,212,191,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.12),transparent_30%),linear-gradient(135deg,#020617_0%,#0a0f1c_50%,#0f172a_100%)]" />
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" 
          />
          <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 right-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-sky-500/10 blur-[100px]" 
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <nav className="flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/sign-in"
                className="hidden items-center justify-center px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg transition-all hover:scale-105 hover:bg-emerald-50 hover:shadow-emerald-500/20"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </nav>

          <div className="grid min-h-[calc(100vh-100px)] items-center gap-16 py-16 lg:grid-cols-[1fr_1.1fr]">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4">
                <HeroLogoMark />
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI study workspace
                </motion.div>
              </div>
              <motion.h1 variants={itemVariants} className="mt-8 text-5xl font-bold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
                Turn messy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">whiteboards</span> into study-ready notes.
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-6 text-lg leading-relaxed text-slate-300/90 md:text-xl">
                Upload a Bangla-English board photo and get a clean summary,
                highlighted code snippets, and flashcards in one focused
                student workflow.
              </motion.p>
              <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/sign-up"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-8 text-base font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/40"
                >
                  Start free
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/sign-in"
                  className="inline-flex h-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/10 hover:border-white/20"
                >
                  Sign in
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
                {['Camera upload', 'Gemma settings', 'Mobile-first'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <PreviewPanel />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-4 py-24 text-slate-950 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                Dynamic workflow
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Everything a student expects after class
              </h2>
            </div>
            <Link
              to="/sign-up"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20"
            >
              Create account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.article
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-slate-200/80 hover:border-emerald-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 transition-colors group-hover:from-emerald-50/50 group-hover:to-transparent" />
                  <div className="relative z-10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md transition-transform group-hover:scale-110 group-hover:bg-emerald-500">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                      {feature.detail}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
