import logoMarkUrl from '../assets/logo-mark.png'
import { Link } from '../lib/router.jsx'

export default function BrandMark() {
  return (
    <Link
      to="/"
      className="inline-flex h-14 w-14 shrink-0 items-center justify-center"
      aria-label="Multimodal Track"
    >
      <img
        src={logoMarkUrl}
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_0_14px_rgba(14,165,233,0.28)]"
        aria-hidden="true"
      />
    </Link>
  )
}
