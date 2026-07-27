import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
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

function EmptyState({ icon: Icon, title, detail }) {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center bg-slate-950 text-white shadow-lg shadow-slate-300/60">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  )
}

function LoadingPanel() {
  return (
    <div className="relative min-h-[430px] overflow-hidden border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="absolute inset-x-0 top-0 h-1 animate-scan bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400" />
      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center bg-slate-950 text-white">
              <ScanLine className="h-6 w-6 animate-pulse" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Board analysis running
              </h3>
              <p className="text-sm text-slate-500">
                Vision model handwriting, diagrams, and code-like text parse korche.
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 w-2/3 animate-pulse bg-slate-200" />
            <div className="h-4 w-full animate-pulse bg-slate-100" />
            <div className="h-4 w-11/12 animate-pulse bg-slate-100" />
            <div className="h-4 w-4/5 animate-pulse bg-slate-100" />
            <div className="h-24 w-full animate-pulse bg-slate-100" />
          </div>
        </div>
        <div className="grid gap-3">
          {['Capture', 'Reason', 'Structure'].map((step, index) => (
            <div key={step} className="border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center bg-white text-sm font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {step}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden bg-white">
                <div
                  className="h-full animate-progress bg-sky-500"
                  style={{ animationDelay: `${index * 180}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApiSettingsDrawer({ settings, onChange, onClose, onReset }) {
  const apiReady = Boolean(settings.gemmaApiKey.trim())

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <section className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-700">
              Configuration
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Gemma API Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                API status
              </span>
              <span
                className={`text-sm font-semibold ${
                  apiReady ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {apiReady ? 'Ready' : 'Needs key'}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Local prototype-e settings browser-e save hoy. Production deploy-e
              backend `.env` use kora better.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <Server className="h-3.5 w-3.5" aria-hidden="true" />
              API URL
            </span>
            <input
              type="url"
              value={settings.gemmaApiUrl}
              onChange={(event) =>
                onChange({ ...settings, gemmaApiUrl: event.target.value })
              }
              className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              placeholder="https://provider.com/v1/openai/chat/completions"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <WandSparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Model
            </span>
            <input
              type="text"
              value={settings.gemmaModel}
              onChange={(event) =>
                onChange({ ...settings, gemmaModel: event.target.value })
              }
              className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              placeholder="google/gemma-4-E4B-it"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              API Key
            </span>
            <input
              type="password"
              value={settings.gemmaApiKey}
              onChange={(event) =>
                onChange({ ...settings, gemmaApiKey: event.target.value })
              }
              className="h-12 w-full border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              placeholder="Paste provider token"
            />
          </label>

          <div className="flex items-start gap-3 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            API key frontend theke backend-e request-er sathe jay. Shared
            production app-e server-side secret use korben.
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset API defaults
          </button>
        </div>
      </section>
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
    <section className="overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-300">
              Step 1
            </p>
            <h2 className="mt-1 text-lg font-semibold">Capture whiteboard</h2>
          </div>
          <span
            className={`h-2.5 w-2.5 ${file ? 'bg-emerald-400' : 'bg-slate-500'}`}
          />
        </div>
      </div>

      <div
        className={`m-5 flex min-h-80 flex-col items-center justify-center border border-dashed px-5 py-8 text-center transition ${
          dragging
            ? 'scale-[1.01] border-sky-500 bg-sky-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="w-full">
            <div className="relative mx-auto max-h-72 max-w-full overflow-hidden border border-slate-200 bg-white">
              <img
                src={previewUrl}
                alt="Uploaded whiteboard preview"
                className="mx-auto max-h-72 w-full object-contain"
              />
              <button
                type="button"
                onClick={onClear}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 truncate text-sm font-semibold text-slate-800">
              {file?.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {(file?.size / 1024 / 1024).toFixed(2)} MB selected
            </p>
          </div>
        ) : (
          <>
            <span className="flex h-16 w-16 animate-float items-center justify-center bg-white text-slate-950 shadow-lg shadow-slate-300/70">
              <ImageUp className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-xl font-semibold text-slate-950">
              Drop board image here
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Clear JPG, PNG, ba WebP upload korun. Phone camera diye direct
              capture kora jabe.
            </p>
          </>
        )}
      </div>

      <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="inline-flex h-12 items-center justify-center gap-2 bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <UploadCloud className="h-4 w-4" aria-hidden="true" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex h-12 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Camera
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file || loading}
          className="inline-flex h-12 items-center justify-center gap-2 bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          )}
          Analyze
        </button>
      </div>

      <div className="border-t border-slate-200 px-5 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">API status</span>
          <span
            className={`font-semibold ${apiReady ? 'text-emerald-700' : 'text-amber-700'}`}
          >
            {apiReady ? 'Ready from settings' : 'Needs key or backend env'}
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
    </section>
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
    <article className="border border-slate-200 bg-white p-6 text-left shadow-xl shadow-slate-200/70">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-2xl font-semibold text-slate-950">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-xl font-semibold text-slate-950">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold text-slate-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-sm leading-7 text-slate-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-700">
              {children}
            </ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="bg-slate-100 px-1.5 py-0.5 text-sm text-slate-900">
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  )
}

function CodeTab({ snippets }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  if (!snippets.length) {
    return (
      <EmptyState
        icon={Code2}
        title="Code snippet paoa jayni"
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
    <div className="space-y-4">
      {snippets.map((snippet, index) => (
        <section
          key={`${snippet.language}-${index}`}
          className="overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/70"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
            <span className="text-sm font-semibold uppercase">
              {snippet.language || 'text'}
            </span>
            <button
              type="button"
              onClick={() => copyCode(snippet.code, index)}
              className="inline-flex h-9 items-center justify-center gap-2 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              ) : (
                <Clipboard className="h-4 w-4" aria-hidden="true" />
              )}
              Copy
            </button>
          </div>
          <SyntaxHighlighter
            language={snippet.language || 'text'}
            style={oneLight}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </section>
      ))}
    </div>
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {flashcards.map((card, index) => {
        const flipped = flippedCards.has(index)

        return (
          <button
            key={`${card.question}-${index}`}
            type="button"
            onClick={() => toggleCard(index)}
            className="h-64 text-left [perspective:1200px]"
            aria-pressed={flipped}
          >
            <span
              className={`relative block h-full w-full transition duration-500 [transform-style:preserve-3d] ${
                flipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              <span className="absolute inset-0 flex flex-col justify-between border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 [backface-visibility:hidden]">
                <span className="text-xs font-semibold uppercase text-sky-700">
                  Question
                </span>
                <span className="text-base font-semibold leading-7 text-slate-950">
                  {card.question}
                </span>
                <span className="text-xs text-slate-500">Tap to flip</span>
              </span>
              <span className="absolute inset-0 flex flex-col justify-between border border-emerald-200 bg-emerald-50 p-5 shadow-xl shadow-emerald-100 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="text-xs font-semibold uppercase text-emerald-700">
                  Answer
                </span>
                <span className="text-sm leading-7 text-slate-800">
                  {card.answer}
                </span>
                <span className="text-xs text-emerald-700">Tap to return</span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Metric({ label, value, tone }) {
  return (
    <div className="border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className={`text-xl font-semibold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
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
      toast.success('Analysis ready')
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
          title="Analysis result ekhane show korbe"
          detail="API settings set kore whiteboard-er clear photo upload korun, then Analyze press korun."
        />
      )
    }
    if (activeTab === 'code') return <CodeTab snippets={result.code_snippets ?? []} />
    if (activeTab === 'flashcards') {
      return <FlashcardsTab flashcards={result.flashcards ?? []} />
    }
    return <SummaryTab markdown={result.markdown_summary} />
  }

  const summaryReady = Boolean(result?.markdown_summary)
  const codeCount = result?.code_snippets?.length ?? 0
  const cardCount = result?.flashcards?.length ?? 0
  const apiReady = Boolean(settings.gemmaApiKey.trim())

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef6f4_45%,#f8f5ef_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-4 md:px-6">
          <BrandMark />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">API Settings</span>
            </button>
            <div className="hidden border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:block">
              <span className="font-semibold text-slate-900">{user?.name}</span>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center justify-center gap-2 bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-5">
          <section className="overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-300/60">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Home workspace
                </span>
                <Gauge className="h-5 w-5 text-sky-200" aria-hidden="true" />
              </div>
              <h1 className="mt-8 text-4xl font-semibold leading-tight">
                Whiteboard to study kit
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Board photo theke clean notes, code, and flashcards ek workflow-e.
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/10">
              <div className="p-4">
                <div className="text-xl font-semibold">01</div>
                <div className="mt-1 text-xs text-slate-400">Upload</div>
              </div>
              <div className="border-x border-white/10 p-4">
                <div className="text-xl font-semibold">02</div>
                <div className="mt-1 text-xs text-slate-400">Analyze</div>
              </div>
              <div className="p-4">
                <div className="text-xl font-semibold">03</div>
                <div className="mt-1 text-xs text-slate-400">Study</div>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 border border-slate-300 bg-white text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            Configure Gemma API
          </button>
        </aside>

        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Metric
              label="Summary"
              value={summaryReady ? 'Ready' : 'Waiting'}
              tone={summaryReady ? 'text-emerald-700' : 'text-slate-700'}
            />
            <Metric label="Code snippets" value={codeCount} tone="text-sky-700" />
            <Metric label="Flashcards" value={cardCount} tone="text-amber-700" />
          </div>

          <div className="grid gap-5 xl:grid-cols-[440px_minmax(0,1fr)]">
            <ImageUploader
              file={file}
              previewUrl={previewUrl}
              onFileSelect={selectFile}
              onClear={clearImage}
              onAnalyze={analyzeImage}
              loading={loading}
              apiReady={apiReady}
            />

            <section className="min-w-0">
              <div className="mb-3 grid grid-cols-3 border border-slate-200 bg-white p-1 shadow-sm">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const selected = activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex h-12 min-w-0 items-center justify-center gap-2 px-3 text-sm font-semibold transition ${
                        selected
                          ? 'bg-slate-950 text-white shadow-lg shadow-slate-300'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
              {renderActiveTab()}
            </section>
          </div>
        </section>
      </div>

      {settingsOpen ? (
        <ApiSettingsDrawer
          settings={settings}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
          onReset={resetSettings}
        />
      ) : null}
    </main>
  )
}
