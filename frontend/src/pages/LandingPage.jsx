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
    accent: '#10b981',
    bg: '#f0fdf4',
  },
  {
    title: 'Markdown study summary',
    detail: 'Headings, bullets, and highlighted terms ready hoy class note ba revision-er jonno.',
    icon: FileText,
    accent: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    title: 'Code extraction',
    detail: 'Pseudocode, formulas, and code-like blocks syntax highlighted snippet hisebe render hoy.',
    icon: Code2,
    accent: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    title: 'Interactive flashcards',
    detail: 'Whiteboard topic theke Q&A cards generate hoy quick recall practice-er jonno.',
    icon: Layers,
    accent: '#f59e0b',
    bg: '#fffbeb',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function PreviewPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      style={{
        width: '100%',
        maxWidth: '520px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: '0 8px 40px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.04)',
      }}
    >

      <div className="preview-inner">
        {/* Left: capture panel */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#10b981' }}>
              Capture
            </span>
            <Camera size={14} color="#94a3b8" />
          </div>
          <div
            style={{
              marginTop: '0.75rem',
              borderRadius: '10px',
              aspectRatio: '4/3',
              border: '1.5px dashed #cbd5e1',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              padding: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ height: '6px', width: '60%', borderRadius: '99px', background: '#cbd5e1' }} />
              <div style={{ marginTop: '0.6rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem' }}>
                <div style={{ height: '36px', borderRadius: '6px', background: 'rgba(16,185,129,0.5)' }} />
                <div style={{ height: '48px', borderRadius: '6px', background: 'rgba(59,130,246,0.5)' }} />
                <div style={{ height: '30px', borderRadius: '6px', background: 'rgba(245,158,11,0.5)' }} />
              </div>
              <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '5px', borderRadius: '99px', background: '#cbd5e1', width: '100%' }} />
                <div style={{ height: '5px', borderRadius: '99px', background: '#e2e8f0', width: '75%' }} />
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{
              marginTop: '0.75rem',
              width: '100%',
              height: '36px',
              background: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <UploadCloud size={13} />
            Analyze board
          </button>
        </div>

        {/* Right: output panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Summary */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#3b82f6' }}>
              <FileText size={11} />
              Summary
            </div>
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ height: '7px', width: '70%', borderRadius: '99px', background: '#1e293b' }} />
              <div style={{ height: '5px', width: '100%', borderRadius: '99px', background: '#e2e8f0' }} />
              <div style={{ height: '5px', width: '90%', borderRadius: '99px', background: '#e2e8f0' }} />
              <div style={{ height: '5px', width: '65%', borderRadius: '99px', background: '#e2e8f0' }} />
            </div>
          </div>

          {/* Bottom two */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div
              style={{
                background: '#f5f3ff',
                border: '1px solid #ede9fe',
                borderRadius: '12px',
                padding: '0.75rem',
              }}
            >
              <Code2 size={16} color="#8b5cf6" />
              <div style={{ marginTop: '0.5rem', height: '5px', width: '80%', borderRadius: '99px', background: 'rgba(139,92,246,0.3)' }} />
              <div style={{ marginTop: '4px', height: '5px', width: '55%', borderRadius: '99px', background: 'rgba(139,92,246,0.2)' }} />
            </div>
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '0.75rem',
              }}
            >
              <Layers size={16} color="#f59e0b" />
              <div style={{ marginTop: '0.4rem', fontSize: '1.4rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>12</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#b45309', marginTop: '1px' }}>Flashcards</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* ── NAV ────────────────────────────────────── */}
      <nav className="landing-nav">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
        >
          <img src={logoMarkUrl} alt="" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
          <span className="nav-brand-text">
            Multimodal Track
          </span>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Link
            to="/sign-in"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#64748b',
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              transition: 'color 0.2s',
            }}
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#fff',
              background: '#0f172a',
              textDecoration: 'none',
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(15,23,42,0.15)',
              transition: 'background 0.2s',
            }}
          >
            Get started
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="landing-hero">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '560px' }}
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: '#10b981',
                background: '#f0fdf4',
                border: '1px solid #d1fae5',
                borderRadius: '99px',
                padding: '0.3rem 0.85rem',
              }}
            >
              <Sparkles size={11} />
              AI study workspace
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            style={{
              marginTop: '1.25rem',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#0f172a',
            }}
          >
            Turn messy{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              whiteboards
            </span>{' '}
            into study-ready notes.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            style={{
              marginTop: '1.25rem',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: '#64748b',
              maxWidth: '440px',
            }}
          >
            Upload a Bangla-English board photo and get a clean summary,
            highlighted code snippets, and flashcards in one focused student workflow.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="hero-ctas">
            <Link
              to="/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                height: '48px',
                padding: '0 1.75rem',
                background: '#0f172a',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(15,23,42,0.18)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Start free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/sign-in"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '48px',
                padding: '0 1.75rem',
                background: '#fff',
                color: '#0f172a',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '10px',
                textDecoration: 'none',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(15,23,42,0.05)',
                transition: 'border-color 0.2s',
              }}
            >
              Sign in
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div variants={itemVariants} className="hero-trust">
            {['Camera upload', 'Gemma AI', 'Mobile-first'].map((item) => (
              <div
                key={item}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 500, color: '#64748b' }}
              >
                <CheckCircle2 size={15} color="#10b981" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Preview */}
        <div className="preview-panel-wrap">
          <PreviewPanel />
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section className="landing-features-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="landing-features-header"
          >
            <div style={{ maxWidth: '520px' }}>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: '#10b981',
                  margin: 0,
                }}
              >
                Dynamic workflow
              </p>
              <h2
                style={{
                  marginTop: '0.5rem',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                Everything a student expects after class
              </h2>
            </div>
            <Link
              to="/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                height: '44px',
                padding: '0 1.5rem',
                background: '#0f172a',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(15,23,42,0.12)',
              }}
            >
              Create account
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="landing-features-grid"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                    transition: 'box-shadow 0.25s, border-color 0.25s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = feature.accent + '55'
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(15,23,42,0.08)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.04)'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: feature.bg,
                      color: feature.accent,
                    }}
                  >
                    <Icon size={22} />
                  </span>
                  <h3
                    style={{
                      marginTop: '1rem',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      lineHeight: 1.7,
                      color: '#64748b',
                    }}
                  >
                    {feature.detail}
                  </p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            Ready to study smarter?
          </h2>
          <p style={{ marginTop: '0.75rem', fontSize: '1rem', color: '#64748b', lineHeight: 1.7 }}>
            Take a photo of your board and let AI do the rest.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                height: '48px',
                padding: '0 2rem',
                background: '#0f172a',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(15,23,42,0.18)',
              }}
            >
              Get started free
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
