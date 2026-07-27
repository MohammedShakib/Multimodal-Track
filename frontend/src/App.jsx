import { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Camera,
  Check,
  Clipboard,
  Code2,
  FileText,
  ImageUp,
  Layers,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

const tabs = [
  { id: 'summary', label: '📝 Summary', icon: FileText },
  { id: 'code', label: '💻 Code', icon: Code2 },
  { id: 'flashcards', label: '🃏 Flashcards', icon: Layers },
]

function EmptyState({ icon: Icon, title, detail }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
      <Icon className="mb-4 h-9 w-9 text-zinc-400" aria-hidden="true" />
      <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-zinc-500">{detail}</p>
    </div>
  )
}

function LoadingPanel() {
  return (
    <div className="relative min-h-72 overflow-hidden border border-zinc-200 bg-white p-6">
      <div className="absolute inset-x-0 top-0 h-1 animate-scan bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400" />
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
        <div className="flex h-10 w-10 items-center justify-center bg-zinc-950 text-white">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-950">
            Board scan cholche
          </h3>
          <p className="text-sm text-zinc-500">
            Bangla-English handwriting parse kore structured notes banano hocche.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="h-5 w-44 animate-pulse bg-zinc-200" />
          <div className="mt-5 space-y-3">
            <div className="h-3 w-full animate-pulse bg-zinc-100" />
            <div className="h-3 w-11/12 animate-pulse bg-zinc-100" />
            <div className="h-3 w-9/12 animate-pulse bg-zinc-100" />
            <div className="h-3 w-10/12 animate-pulse bg-zinc-100" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-20 animate-pulse bg-zinc-100" />
          <div className="h-20 animate-pulse bg-zinc-100" />
        </div>
      </div>
    </div>
  )
}

function ImageUploader({ file, previewUrl, onFileSelect, onClear, onAnalyze, loading }) {
  const uploadInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      onFileSelect(droppedFile)
    }
  }

  return (
    <section className="border border-zinc-200 bg-white p-4 md:p-5">
      <div
        className={`flex min-h-80 flex-col items-center justify-center border border-dashed px-5 py-8 text-center transition ${
          dragging
            ? 'border-sky-500 bg-sky-50'
            : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400'
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
            <div className="relative mx-auto max-h-72 max-w-full overflow-hidden border border-zinc-200 bg-white">
              <img
                src={previewUrl}
                alt="Uploaded whiteboard preview"
                className="mx-auto max-h-72 w-full object-contain"
              />
              <button
                type="button"
                onClick={onClear}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-white text-zinc-700 shadow-sm hover:bg-zinc-100"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 truncate text-sm font-medium text-zinc-700">
              {file?.name}
            </p>
          </div>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center bg-zinc-950 text-white">
              <ImageUp className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-zinc-950">
              Whiteboard image upload korun
            </h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              JPG, PNG, ba WebP image drag-drop korun. Mobile theke direct camera diye board capture kora jabe.
            </p>
          </>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          <UploadCloud className="h-4 w-4" aria-hidden="true" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex h-11 items-center justify-center gap-2 border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Camera
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file || loading}
          className="inline-flex h-11 items-center justify-center gap-2 bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
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
    <article className="border border-zinc-200 bg-white p-5 text-left">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-2xl font-semibold text-zinc-950">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-semibold text-zinc-950">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold text-zinc-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-sm leading-7 text-zinc-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 text-sm leading-7 text-zinc-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-zinc-700">
              {children}
            </ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-950">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-900">
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
          className="overflow-hidden border border-zinc-200 bg-white"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              {snippet.language || 'text'}
            </span>
            <button
              type="button"
              onClick={() => copyCode(snippet.code, index)}
              className="inline-flex h-9 items-center justify-center gap-2 border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
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
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
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
            className="h-64 [perspective:1200px]"
            aria-pressed={flipped}
          >
            <span
              className={`relative block h-full w-full transition duration-500 [transform-style:preserve-3d] ${
                flipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              <span className="absolute inset-0 flex flex-col justify-between border border-zinc-200 bg-white p-5 text-left [backface-visibility:hidden]">
                <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                  Question
                </span>
                <span className="text-base font-semibold leading-7 text-zinc-950">
                  {card.question}
                </span>
                <span className="text-xs text-zinc-500">Tap to flip</span>
              </span>
              <span className="absolute inset-0 flex flex-col justify-between border border-emerald-200 bg-emerald-50 p-5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Answer
                </span>
                <span className="text-sm leading-7 text-zinc-800">
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

function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [loading, setLoading] = useState(false)

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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setResult(null)
  }

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(null)
    setPreviewUrl('')
    setResult(null)
  }

  const analyzeImage = async () => {
    if (!file || loading) return

    const formData = new FormData()
    formData.append('image', file)
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

  const renderActiveTab = () => {
    if (loading) return <LoadingPanel />

    if (!result) {
      return (
        <EmptyState
          icon={Sparkles}
          title="Analysis result ekhane show korbe"
          detail="Whiteboard-er ekta clear photo upload kore Analyze press korun."
        />
      )
    }

    if (activeTab === 'code') {
      return <CodeTab snippets={result.code_snippets ?? []} />
    }

    if (activeTab === 'flashcards') {
      return <FlashcardsTab flashcards={result.flashcards ?? []} />
    }

    return <SummaryTab markdown={result.markdown_summary} />
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <Toaster position="top-right" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 md:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 border-b border-zinc-300 pb-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Multimodal Track
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-950 md:text-4xl">
              Whiteboard theke study notes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Messy Bangla-English board photo upload korun. Platform summary,
              code snippet, ebong flashcard structured output dibe.
            </p>
          </div>
          <div className="grid grid-cols-3 border border-zinc-200 bg-white text-center">
            <div className="px-4 py-3">
              <div className="text-lg font-semibold text-zinc-950">3</div>
              <div className="text-xs text-zinc-500">Tabs</div>
            </div>
            <div className="border-x border-zinc-200 px-4 py-3">
              <div className="text-lg font-semibold text-zinc-950">8MB</div>
              <div className="text-xs text-zinc-500">Max</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-lg font-semibold text-zinc-950">JSON</div>
              <div className="text-xs text-zinc-500">Output</div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <ImageUploader
            file={file}
            previewUrl={previewUrl}
            onFileSelect={selectFile}
            onClear={clearImage}
            onAnalyze={analyzeImage}
            loading={loading}
          />

          <section className="min-w-0">
            <div className="mb-3 flex overflow-x-auto border border-zinc-200 bg-white p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const selected = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex h-10 min-w-max flex-1 items-center justify-center gap-2 px-4 text-sm font-semibold transition ${
                      selected
                        ? 'bg-zinc-950 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
            {renderActiveTab()}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
