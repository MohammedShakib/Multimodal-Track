import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Camera,
  Check,
  Clipboard,
  Code2,
  FileText,
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
  UserRound,
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
  { id: 'summary', label: 'Notes', icon: FileText },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'flashcards', label: 'Cards', icon: Layers },
]

const fadeUpVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

function getUserInitials(user) {
  const source = user?.name?.trim() || user?.email?.split('@')[0] || ''
  const parts = source
    .replace(/[^a-zA-Z0-9\s._-]/g, '')
    .split(/[\s._-]+/)
    .filter(Boolean)

  if (!parts.length) return ''

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function ProfileAvatar({ user }) {
  const initials = getUserInitials(user)

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className="h-full w-full rounded-full object-cover"
        aria-hidden="true"
      />
    )
  }

  if (initials) {
    return (
      <span className="text-sm font-semibold tracking-wide text-slate-800">
        {initials}
      </span>
    )
  }

  return <UserRound className="h-5 w-5 text-slate-600" aria-hidden="true" />
}

function EmptyState({ icon: Icon, title, detail }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-emerald-600 shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{detail}</p>
    </motion.div>
  )
}

function LoadingPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative min-h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="absolute inset-x-0 top-0 h-1 animate-scan bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400" />
      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        <div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-emerald-400">
              <ScanLine className="h-5 w-5 animate-pulse" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Analysis running
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Extracting notes, code blocks, and study prompts.
              </p>
            </div>
          </div>
          <div className="mt-7 space-y-3">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-100" />
            <div className="h-28 w-full animate-pulse rounded-lg bg-slate-50" />
          </div>
        </div>
        <div className="grid gap-3">
          {['Capture', 'Read', 'Format'].map((step, index) => (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12 }}
              key={step}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-emerald-700">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {step}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full animate-progress rounded-full bg-emerald-500"
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

function ErrorPanel({ error, onOpenSettings }) {
  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[360px] rounded-lg border border-rose-200 bg-rose-50 p-5 text-left"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-rose-600 shadow-sm">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-rose-950">
              Analysis failed
            </h3>
            {error.statusCode && (
              <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                HTTP {error.statusCode}
              </span>
            )}
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-rose-200 bg-white p-4 text-sm leading-6 text-rose-900">
            {error.message}
          </p>
          {error.code && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-rose-700">
              {error.code}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-800 shadow-sm transition hover:bg-rose-100"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ApiSettingsDrawer({ settings, backendConfig, onChange, onClose, onReset }) {
  const localApiReady = Boolean(settings.gemmaApiKey.trim())
  const apiReady = backendConfig.configured || localApiReady

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/30 backdrop-blur-sm"
      />
      <motion.section
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
        className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Configuration
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              API Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                API status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                  apiReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${apiReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {backendConfig.configured
                  ? 'Backend ready'
                  : localApiReady
                  ? 'Browser key'
                  : 'Needs key'}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {backendConfig.configured
                ? 'Render backend environment variables are configured. Browser API key input is optional.'
                : 'Add backend environment variables in Render, or use a browser key for local testing.'}
            </p>
            {backendConfig.configured && (
              <p className="mt-2 truncate text-xs font-medium text-slate-600">
                Backend model: {backendConfig.model || 'default'}
              </p>
            )}
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Server className="h-4 w-4" aria-hidden="true" />
                API URL Override
              </span>
              <input
                type="url"
                value={settings.gemmaApiUrl}
                onChange={(event) =>
                  onChange({ ...settings, gemmaApiUrl: event.target.value })
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15"
                placeholder={backendConfig.apiUrl || 'https://provider.com/v1/...'}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <WandSparkles className="h-4 w-4" aria-hidden="true" />
                Model Override
              </span>
              <input
                type="text"
                value={settings.gemmaModel}
                onChange={(event) =>
                  onChange({ ...settings, gemmaModel: event.target.value })
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15"
                placeholder={backendConfig.model || 'gemma-4-31b-it'}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                API Key Override
              </span>
              <input
                type="password"
                value={settings.gemmaApiKey}
                onChange={(event) =>
                  onChange({ ...settings, gemmaApiKey: event.target.value })
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15"
                placeholder={backendConfig.configured ? 'Optional' : 'Paste provider token'}
              />
            </label>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p>Frontend override keys are visible to the browser. Render backend environment variables are the safer production setup.</p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Input
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Capture whiteboard
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-semibold ${
            file ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${file ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {file ? 'Image ready' : 'Empty'}
        </span>
      </div>

      <div
        className={`m-5 flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center transition ${
          dragging
            ? 'border-sky-500 bg-sky-50'
            : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/60'
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <div className="relative mx-auto max-h-72 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img
                  src={previewUrl}
                  alt="Uploaded whiteboard preview"
                  className="mx-auto max-h-72 w-full object-contain"
                />
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-4 truncate text-sm font-semibold text-slate-800">
                {file?.name}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {(file?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white text-emerald-600 shadow-sm">
                <ImageUp className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">
                Drop board image here
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                JPG, PNG, and WebP are supported.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <UploadCloud className="h-4 w-4" aria-hidden="true" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Camera
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file || loading || !apiReady}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          )}
          Analyze
        </button>
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
        title="No summary yet"
        detail="Run an analysis to generate structured notes from the board."
      />
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-slate max-w-none rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm"
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-5 border-b border-slate-100 pb-4 text-2xl font-semibold text-slate-950">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-7 text-xl font-semibold text-slate-950">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-5 text-lg font-semibold text-slate-800">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-sm leading-7 text-slate-600">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-5 list-none space-y-2 pl-0 text-sm text-slate-600">
              {children}
            </ul>
          ),
          li: ({ children, ...props }) => (
            <li className="flex gap-3" {...props}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{children}</span>
            </li>
          ),
          ol: ({ children }) => (
            <ol className="mb-5 list-decimal space-y-2 pl-6 text-sm text-slate-600">
              {children}
            </ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-emerald-700">
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
        detail="Code blocks and pseudocode appear here after analysis."
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
      className="space-y-4"
    >
      {snippets.map((snippet, index) => (
        <motion.section
          variants={fadeUpVariants}
          key={`${snippet.language}-${index}`}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-5 py-3 text-white">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              {snippet.language || 'text'}
            </span>
            <button
              type="button"
              onClick={() => copyCode(snippet.code, index)}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/20"
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <Clipboard className="h-4 w-4" aria-hidden="true" />
              )}
              Copy
            </button>
          </div>
          <div className="p-2">
            <SyntaxHighlighter
              language={snippet.language || 'text'}
              style={oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: 14,
                lineHeight: 1.65,
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
        title="No cards yet"
        detail="Question and answer cards appear here after analysis."
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
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {flashcards.map((card, index) => {
        const flipped = flippedCards.has(index)

        return (
          <motion.button
            variants={fadeUpVariants}
            key={`${card.question}-${index}`}
            type="button"
            onClick={() => toggleCard(index)}
            className="group h-64 text-left [perspective:1200px] outline-none"
            aria-pressed={flipped}
          >
            <span
              className={`relative block h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${
                flipped ? '[transform:rotateY(180deg)]' : 'group-hover:-translate-y-0.5'
              }`}
            >
              <span className="absolute inset-0 flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm [backface-visibility:hidden]">
                <span className="inline-flex w-fit items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                  Question
                </span>
                <span className="text-base font-semibold leading-7 text-slate-950">
                  {card.question}
                </span>
                <span className="text-xs font-medium text-slate-400">Tap to flip</span>
              </span>
              <span className="absolute inset-0 flex flex-col justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="inline-flex w-fit items-center rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Answer
                </span>
                <span className="overflow-y-auto pr-2 text-sm font-medium leading-6 text-slate-800">
                  {card.answer}
                </span>
                <span className="pt-3 text-xs font-medium text-emerald-700">Tap to return</span>
              </span>
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [loading, setLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const [settings, setSettings] = useState(getStoredSettings)
  const [backendConfig, setBackendConfig] = useState({
    configured: false,
    apiUrl: '',
    model: '',
  })

  useEffect(() => {
    persistSettings(settings)
  }, [settings])

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_URL}/config`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null
        return response.json()
      })
      .then((payload) => {
        if (payload) {
          setBackendConfig({
            configured: Boolean(payload.configured),
            apiUrl: payload.apiUrl ?? '',
            model: payload.model ?? '',
          })
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setBackendConfig({ configured: false, apiUrl: '', model: '' })
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!profileOpen) return undefined

    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('mousedown', closeProfileMenu)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeProfileMenu)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileOpen])

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
    setAnalysisError(null)
  }

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')
    setResult(null)
    setAnalysisError(null)
  }

  const analyzeImage = async () => {
    if (!file || loading) return
    if (!apiReady) {
      const configError = {
        message: 'Add GEMMA_API_KEY in Render backend or use a browser override.',
        statusCode: 503,
        code: 'API_NOT_CONFIGURED',
      }
      setResult(null)
      setAnalysisError(configError)
      toast.error(configError.message)
      setSettingsOpen(true)
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('userName', user?.name || '')
    formData.append('userEmail', user?.email || '')
    if (settings.gemmaApiKey.trim()) {
      formData.append('gemmaApiUrl', settings.gemmaApiUrl)
      formData.append('gemmaModel', settings.gemmaModel)
      formData.append('gemmaApiKey', settings.gemmaApiKey)
    }
    setLoading(true)
    setAnalysisError(null)

    try {
      const response = await fetch(`${API_URL}/analyze-board`, {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const requestError = new Error(payload.message || 'Could not analyze this image.')
        requestError.statusCode = payload.statusCode || response.status
        requestError.code = payload.code || 'ANALYSIS_FAILED'
        throw requestError
      }
      setResult(payload)
      setAnalysisError(null)
      setActiveTab('summary')
      toast.success('Analysis ready')
    } catch (error) {
      setResult(null)
      setAnalysisError({
        message: error.message || 'Could not analyze this image.',
        statusCode: error.statusCode,
        code: error.code || 'ANALYSIS_FAILED',
      })
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
    setProfileOpen(false)
    logout()
    navigate('/')
  }

  const renderActiveTab = () => {
    if (loading) return <LoadingPanel />
    if (analysisError) {
      return (
        <ErrorPanel
          error={analysisError}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )
    }
    if (!result) {
      return (
        <EmptyState
          icon={Sparkles}
          title="No analysis yet"
          detail="Upload a board image and run analysis to fill this panel."
        />
      )
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'code' && <CodeTab snippets={result.code_snippets ?? []} />}
          {activeTab === 'flashcards' && <FlashcardsTab flashcards={result.flashcards ?? []} />}
          {activeTab === 'summary' && <SummaryTab markdown={result.markdown_summary} />}
        </motion.div>
      </AnimatePresence>
    )
  }

  const localApiReady = Boolean(settings.gemmaApiKey.trim())
  const apiReady = backendConfig.configured || localApiReady

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 selection:bg-emerald-500/25">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-slate-950">
                Multimodal Track
              </p>
              <p className="truncate text-xs text-slate-500">
                Board analysis dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-white shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-slate-300/60"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Open profile menu"
              >
                <ProfileAvatar user={user} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {user?.name || 'Profile'}
                      </p>
                      {user?.email && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false)
                        setSettingsOpen(true)
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      role="menuitem"
                    >
                      <Settings2 className="h-4 w-4" aria-hidden="true" />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={signOut}
                      className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-6 md:px-6 xl:grid-cols-[minmax(360px,440px)_minmax(0,1fr)]">
        <ImageUploader
          file={file}
          previewUrl={previewUrl}
          onFileSelect={selectFile}
          onClear={clearImage}
          onAnalyze={analyzeImage}
          loading={loading}
          apiReady={apiReady}
        />

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Output
              </p>
              <h1 className="mt-1 text-lg font-semibold text-slate-950">
                Analysis results
              </h1>
            </div>
            <div className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 p-1 sm:w-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const selected = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold transition sm:min-w-[96px] sm:gap-2 sm:px-3 sm:text-sm ${
                      selected ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          {renderActiveTab()}
        </motion.section>
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <ApiSettingsDrawer
            settings={settings}
            backendConfig={backendConfig}
            onChange={setSettings}
            onClose={() => setSettingsOpen(false)}
            onReset={resetSettings}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
