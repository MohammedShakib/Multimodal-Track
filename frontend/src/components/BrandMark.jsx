import { Sparkles } from 'lucide-react'
import { Link } from '../lib/router.jsx'

export default function BrandMark({ dark = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <span
        className={`flex h-10 w-10 items-center justify-center ${
          dark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'
        }`}
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span
          className={`block text-sm font-semibold uppercase ${
            dark ? 'text-white' : 'text-slate-950'
          }`}
        >
          Multimodal Track
        </span>
        <span className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          Whiteboard AI Studio
        </span>
      </span>
    </Link>
  )
}
