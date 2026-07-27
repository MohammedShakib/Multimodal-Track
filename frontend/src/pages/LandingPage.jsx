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
import BrandMark from '../components/BrandMark.jsx'
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

function PreviewPanel() {
  return (
    <div className="relative mx-auto w-full max-w-xl border border-white/20 bg-white/10 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <div className="grid gap-3 md:grid-cols-[1fr_1.25fr]">
        <div className="border border-white/15 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-300">
              Capture
            </span>
            <Camera className="h-4 w-4 text-slate-300" aria-hidden="true" />
          </div>
          <div className="mt-4 aspect-[4/3] border border-dashed border-slate-500 bg-[linear-gradient(135deg,#f8fafc_0%,#e0f2fe_50%,#ecfdf5_100%)] p-4 text-slate-900">
            <div className="h-2 w-24 bg-slate-800" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-14 bg-emerald-200" />
              <div className="h-20 bg-sky-200" />
              <div className="h-12 bg-amber-200" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-2 w-full bg-slate-400" />
              <div className="h-2 w-3/4 bg-slate-300" />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 bg-emerald-400 text-sm font-semibold text-slate-950"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Analyze board
          </button>
        </div>
        <div className="space-y-3">
          <div className="border border-white/15 bg-white p-4 text-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-sky-700">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Summary
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-3/4 bg-slate-900" />
              <div className="h-2 w-full bg-slate-200" />
              <div className="h-2 w-11/12 bg-slate-200" />
              <div className="h-2 w-2/3 bg-slate-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-white/15 bg-slate-950 p-4 text-white">
              <Code2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              <div className="mt-5 h-2 w-20 bg-white/80" />
              <div className="mt-2 h-2 w-14 bg-white/40" />
            </div>
            <div className="border border-white/15 bg-amber-100 p-4 text-slate-950">
              <Layers className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <div className="mt-5 text-2xl font-semibold">12</div>
              <div className="text-xs text-slate-600">Flashcards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(251,191,36,0.18),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#111827_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <BrandMark dark />
            <div className="flex items-center gap-3">
              <Link
                to="/sign-in"
                className="hidden h-10 items-center justify-center px-4 text-sm font-semibold text-slate-200 hover:bg-white/10 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex h-10 items-center justify-center gap-2 bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-100"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </nav>

          <div className="grid min-h-[calc(100vh-96px)] items-center gap-12 py-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                AI study workspace
              </div>
              <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight md:text-6xl">
                Turn messy whiteboards into study-ready notes.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Upload a Bangla-English board photo and get a clean summary,
                highlighted code snippets, and flashcards in one focused
                student workflow.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/sign-up"
                  className="inline-flex h-12 items-center justify-center gap-2 bg-emerald-400 px-6 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-950/30 hover:bg-emerald-300"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/sign-in"
                  className="inline-flex h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                {['Camera upload', 'Gemma settings', 'Mobile-first'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <PreviewPanel />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 text-slate-950 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-700">
                Dynamic workflow
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Everything a student expects after class
              </h2>
            </div>
            <Link
              to="/sign-up"
              className="inline-flex h-11 items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  className="border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center bg-slate-950 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.detail}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
