import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Check,
  Clipboard,
  Code2,
  FileText,
  Gauge,
  ImageUp,
  KeyRound,
  Layers,
  Loader2,
  LockKeyhole,
  LogOut,
  RotateCcw,
  ScanLine,
  Server,
  Settings2,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X,
} from 'lucide-react'
import BrandMark from '../components/BrandMark.jsx'
import useAuth from '../context/useAuth.js'
import { useNavigate } from '../lib/routerHooks.js'
import {
  defaultSettings,
  getStoredSettings,
  persistSettings,
} from '../lib/gemmaSettings.js'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

const tabs = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
]

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

function EmptyState({ icon: Icon, title, detail }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 backdrop-blur-sm px-6 py-10 text-center"
    >
      <motion.span 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/30"
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </motion.span>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{detail}</p>
    </motion.div>
  )
}

function LoadingPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative min-h-[430px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 animate-scan bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400" />
      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
              <ScanLine className="h-7 w-7 animate-pulse text-emerald-400" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Board analysis running
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Vision model parsing handwriting, diagrams, and code structures.
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-100" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-slate-50" />
          </div>
        </div>
        <div className="grid gap-4">
          {['Capture', 'Reason', 'Structure'].map((step, index) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              key={step} 
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-emerald-600 shadow-sm">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {step}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full animate-progress bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full"
                  style={{ animationDelay: `${index * 180}ms` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ApiSettingsDrawer({ settings, onChange, onClose, onReset }) {
  const apiReady = Boolean(settings.gemmaApiKey.trim())

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm cursor-default"
      />
      <motion.section 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Configuration
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              API Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">
                API status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                  apiReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${apiReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {apiReady ? 'Ready' : 'Needs key'}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Local prototype settings are saved in your browser. For production, backend `.env` configuration is recommended.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block group">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                <Server className="h-4 w-4" aria-hidden="true" />
                API URL
              </span>
              <input
                type="url"
                value={settings.gemmaApiUrl}
                onChange={(event) =>
                  onChange({ ...settings, gemmaApiUrl: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="https://provider.com/v1/..."
              />
            </label>

            <label className="block group">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                <WandSparkles className="h-4 w-4" aria-hidden="true" />
                Model
              </span>
              <input
                type="text"
                value={settings.gemmaModel}
                onChange={(event) =>
                  onChange({ ...settings, gemmaModel: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="google/gemma-4-E4B-it"
              />
            </label>

            <label className="block group">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-emerald-600">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                API Key
              </span>
              <input
                type="password"
                value={settings.gemmaApiKey}
                onChange={(event) =>
                  onChange({ ...settings, gemmaApiKey: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Paste provider token"
              />
            </label>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-900 border border-amber-100">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p>API keys are sent from the frontend to backend requests. Use server-side secrets in production.</p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Defaults
          </button>
        </div>
      </motion.section>
    </div>
  )
}

function ImageUploader({
  file,
  previewUrl,
  onFileSelect,
  onClear,
  onAnalyze,
  loading,
  apiReady,
}) {
  const uploadInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) onFileSelect(droppedFile)
  }

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
    >
      <div className="bg-slate-950 px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Step 1
            </p>
            <h2 className="mt-1 text-xl font-bold">Capture whiteboard</h2>
          </div>
          <span
            className={`h-3 w-3 rounded-full shadow-sm ${file ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-slate-600'}`}
          />
        </div>
      </div>

      <div
        className={`m-6 flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-all duration-300 ${
          dragging
            ? 'scale-[1.02] border-sky-500 bg-sky-50/50'
            : 'border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-emerald-50/30'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <div className="relative mx-auto max-h-72 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={previewUrl}
                  alt="Uploaded whiteboard preview"
                  className="mx-auto max-h-72 w-full object-contain"
                />
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-4 truncate text-sm font-bold text-slate-800">
                {file?.name}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {(file?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <span className="flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-white text-slate-900 shadow-xl shadow-slate-200">
                <ImageUp className="h-10 w-10 text-emerald-500" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Drop board image here
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Support for JPG, PNG, or WebP. Take a photo directly from your device.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-3 px-6 pb-6 sm:grid-cols-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800"
        >
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
          Upload
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
        >
          <Camera className="h-5 w-5" aria-hidden="true" />
          Camera
        </motion.button>
        <motion.button
          whileHover={{ scale: !file || loading ? 1 : 1.02 }}
          whileTap={{ scale: !file || loading ? 1 : 0.98 }}
          type="button"
          onClick={onAnalyze}
          disabled={!file || loading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          )}
          Analyze
        </motion.button>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">API Status</span>
          <span
            className={`font-bold tracking-wide uppercase ${apiReady ? 'text-emerald-600' : 'text-amber-600'}`}
          >
            {apiReady ? 'Ready' : 'Needs Config'}
          </span>
        </div>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => onFileSelect(event.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => onFileSelect(event.target.files?.[0])}
      />
    </motion.section>
  )
}

function SummaryTab({ markdown }) {
  if (!markdown) {
    return (
      <EmptyState
        icon={FileText}
        title="Summary ekhono nei"
        detail="Readable board image analyze korle ekhane markdown notes show korbe."
      />
    )
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-xl shadow-slate-200/50"
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-8 text-2xl font-bold text-slate-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-6 text-xl font-bold text-slate-800">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-base leading-relaxed text-slate-600">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 list-none space-y-3 pl-0 text-base text-slate-600">
              {children}
            </ul>
          ),
          li: ({ children, ...props }) => (
             <li className="flex gap-3" {...props}>
               <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
               <span>{children}</span>
             </li>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-decimal space-y-3 pl-6 text-base text-slate-600 font-medium">
              {children}
            </ol>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-emerald-600">
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </motion.article>
  )
}

function CodeTab({ snippets }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  if (!snippets.length) {
    return (
      <EmptyState
        icon={Code2}
        title="No code detected"
        detail="Board-e pseudocode, formula-like logic, ba real code thakle ekhane syntax highlighted output ashbe."
      />
    )
  }

  const copyCode = async (code, index) => {
    await navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    toast.success('Code copied')
    window.setTimeout(() => setCopiedIndex(null), 1200)
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {snippets.map((snippet, index) => (
        <motion.section
          variants={fadeUpVariants}
          key={`${snippet.language}-${index}`}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-5 py-4 text-white">
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              {snippet.language || 'text'}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => copyCode(snippet.code, index)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <Clipboard className="h-4 w-4" aria-hidden="true" />
              )}
              Copy
            </motion.button>
          </div>
          <div className="p-2">
            <SyntaxHighlighter
              language={snippet.language || 'text'}
              style={oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0.75rem',
                fontSize: 14,
                lineHeight: 1.7,
                backgroundColor: 'transparent',
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </motion.section>
      ))}
    </motion.div>
  )
}

function FlashcardsTab({ flashcards }) {
  const [flippedCards, setFlippedCards] = useState(() => new Set())

  if (!flashcards.length) {
    return (
      <EmptyState
        icon={Layers}
        title="Flashcard ekhono nei"
        detail="Analyze result theke question-answer pair generate hole ekhane interactive cards dekhabe."
      />
    )
  }

  const toggleCard = (index) => {
    setFlippedCards((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {flashcards.map((card, index) => {
        const flipped = flippedCards.has(index)

        return (
          <motion.button
            variants={fadeUpVariants}
            key={`${card.question}-${index}`}
            type="button"
            onClick={() => toggleCard(index)}
            className="group h-72 text-left [perspective:1200px] outline-none"
            aria-pressed={flipped}
          >
            <span
              className={`relative block h-full w-full transition-all duration-700 [transform-style:preserve-3d] ${
                flipped ? '[transform:rotateY(180deg)]' : 'group-hover:scale-[1.02] group-hover:shadow-2xl'
              }`}
            >
              {/* Front */}
              <span className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 [backface-visibility:hidden]">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-600">
                  Question
                </span>
                <span className="text-lg font-bold leading-relaxed text-slate-900">
                  {card.question}
                </span>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-sky-500 transition-colors">Tap to flip &rarr;</span>
              </span>
              {/* Back */}
              <span className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 shadow-xl shadow-emerald-200/50 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-200/50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
                  Answer
                </span>
                <span className="text-base font-medium leading-relaxed text-slate-800 overflow-y-auto pr-2 custom-scrollbar">
                  {card.answer}
                </span>
                <span className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors pt-4">&larr; Tap to return</span>
              </span>
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

function Metric({ label, value, tone }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-lg shadow-slate-200/40 transition-all hover:shadow-xl hover:border-emerald-200"
    >
      <div className={`text-3xl font-black tracking-tight ${tone}`}>{value}</div>
      <div className="mt-2 text-sm font-bold uppercase tracking-wider text-slate-500">{label}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [loading, setLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(getStoredSettings)

  useEffect(() => {
    persistSettings(settings)
  }, [settings])

  const selectFile = (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }
    if (selectedFile.size > 8 * 1024 * 1024) {
      toast.error('Image size must be under 8MB.')
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setResult(null)
  }

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')
    setResult(null)
  }

  const analyzeImage = async () => {
    if (!file || loading) return

    const formData = new FormData()
    formData.append('image', file)
    formData.append('gemmaApiUrl', settings.gemmaApiUrl)
    formData.append('gemmaModel', settings.gemmaModel)
    formData.append('gemmaApiKey', settings.gemmaApiKey)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/analyze-board`, {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Could not analyze this image.')
      }
      setResult(payload)
      setActiveTab('summary')
      toast.success('Analysis ready', { icon: '✨' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    toast.success('API settings reset')
  }

  const signOut = () => {
    logout()
    navigate('/')
  }

  const renderActiveTab = () => {
    if (loading) return <LoadingPanel />
    if (!result) {
      return (
        <EmptyState
          icon={Sparkles}
          title="Analysis result goes here"
          detail="Set API settings, upload a clear board photo, and press Analyze."
        />
      )
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'code' && <CodeTab snippets={result.code_snippets ?? []} />}
          {activeTab === 'flashcards' && <FlashcardsTab flashcards={result.flashcards ?? []} />}
          {activeTab === 'summary' && <SummaryTab markdown={result.markdown_summary} />}
        </motion.div>
      </AnimatePresence>
    )
  }

  const summaryReady = Boolean(result?.markdown_summary)
  const codeCount = result?.code_snippets?.length ?? 0
  const cardCount = result?.flashcards?.length ?? 0
  const apiReady = Boolean(settings.gemmaApiKey.trim())

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 md:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <BrandMark />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Settings</span>
            </motion.button>
            <div className="hidden items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm md:flex">
              <span className="font-bold text-slate-900">{user?.name}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-6">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl shadow-slate-900/30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(52,211,153,0.15),transparent_50%)]" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Workspace
                </span>
                <Gauge className="h-6 w-6 text-emerald-400 opacity-80" aria-hidden="true" />
              </div>
              <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight">
                Whiteboard to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">study kit</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Transform any board photo into clean notes, formatted code, and interactive flashcards.
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/10 bg-white/5 backdrop-blur-md divide-x divide-white/10">
              <div className="p-5 text-center">
                <div className="text-2xl font-bold text-white">01</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Upload</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-2xl font-bold text-white">02</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Analyze</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-2xl font-bold text-emerald-400">03</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Study</div>
              </div>
            </div>
          </motion.section>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Settings2 className="h-5 w-5" aria-hidden="true" />
            Configure AI Model Settings
          </motion.button>
        </aside>

        <section className="space-y-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div variants={fadeUpVariants}>
              <Metric
                label="Summary"
                value={summaryReady ? 'Ready' : 'Waiting'}
                tone={summaryReady ? 'text-emerald-500' : 'text-slate-400'}
              />
            </motion.div>
            <motion.div variants={fadeUpVariants}>
              <Metric label="Code Snippets" value={codeCount} tone="text-sky-500" />
            </motion.div>
            <motion.div variants={fadeUpVariants}>
              <Metric label="Flashcards" value={cardCount} tone="text-amber-500" />
            </motion.div>
          </motion.div>

          <div className="grid gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ImageUploader
                file={file}
                previewUrl={previewUrl}
                onFileSelect={selectFile}
                onClear={clearImage}
                onAnalyze={analyzeImage}
                loading={loading}
                apiReady={apiReady}
              />
            </motion.div>

            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="min-w-0"
            >
              <div className="mb-6 inline-flex rounded-2xl border border-slate-200 bg-white/60 p-1.5 shadow-sm backdrop-blur-md">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const selected = activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                        selected ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {selected && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-emerald-50 shadow-sm border border-emerald-100" 
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className={`relative z-10 h-4 w-4 shrink-0 ${selected ? 'text-emerald-600' : ''}`} aria-hidden="true" />
                      <span className="relative z-10 truncate">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="min-h-[400px]">
                {renderActiveTab()}
              </div>
            </motion.section>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <ApiSettingsDrawer
            settings={settings}
            onChange={setSettings}
            onClose={() => setSettingsOpen(false)}
            onReset={resetSettings}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
