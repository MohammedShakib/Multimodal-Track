import { motion } from 'framer-motion'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import BrandMark from '../components/BrandMark.jsx'
import useAuth from '../context/useAuth.js'
import { Link } from '../lib/router.jsx'
import { useNavigate } from '../lib/routerHooks.js'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [focused, setFocused] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)

  const focusNextOnEnter = (event, nextRef) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    nextRef.current?.focus()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitting) return
    if (!form.name.trim()) {
      toast.error('Enter your full name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await signUp({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      toast.success('Account created')
      navigate('/home')
    } catch (error) {
      toast.error(error.message || 'Could not create account.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = (fieldName) => ({
    width: '100%',
    height: '46px',
    background: '#fff',
    border: focused === fieldName ? '1.5px solid #10b981' : '1.5px solid #e2e8f0',
    borderRadius: '10px',
    padding: '0 1rem',
    fontSize: '0.9rem',
    color: '#0f172a',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    boxShadow: focused === fieldName ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
  })

  const labelStyle = (fieldName) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: focused === fieldName ? '#10b981' : '#94a3b8',
    marginBottom: '0.45rem',
    transition: 'color 0.2s',
  })

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Card */}
        <div className="auth-card">
          {/* Brand */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '2rem',
              gap: '0.5rem',
            }}
          >
            <BrandMark />
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              Multimodal Track
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Create your account
            </h1>
            <p style={{ marginTop: '0.4rem', fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Start turning your classroom boards into study material.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full name */}
            <div>
              <label style={labelStyle('name')}>
                <UserRound size={12} />
                Full name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                onKeyDown={(event) => focusNextOnEnter(event, emailInputRef)}
                placeholder="Your name"
                style={inputStyle('name')}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle('email')}>
                <Mail size={12} />
                Email
              </label>
              <input
                ref={emailInputRef}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                onKeyDown={(event) => focusNextOnEnter(event, passwordInputRef)}
                placeholder="you@example.com"
                style={inputStyle('email')}
              />
            </div>

            {/* Password row */}
            <div className="password-row">
              <div>
                <label style={labelStyle('password')}>
                  <LockKeyhole size={12} />
                  Password
                </label>
                <input
                  ref={passwordInputRef}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  onKeyDown={(event) => focusNextOnEnter(event, confirmPasswordInputRef)}
                  placeholder="Min 6 chars"
                  style={inputStyle('password')}
                />
              </div>
              <div>
                <label style={labelStyle('confirm')}>
                  <LockKeyhole size={12} />
                  Confirm
                </label>
                <input
                  ref={confirmPasswordInputRef}
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  placeholder="Repeat"
                  style={inputStyle('confirm')}
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '0.25rem',
                width: '100%',
                height: '46px',
                background: '#0f172a',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                letterSpacing: '0.01em',
                boxShadow: '0 2px 12px rgba(15,23,42,0.15)',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Creating...' : 'Create account'}
              <ArrowRight size={16} />
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{ marginTop: '1.4rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/sign-in" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
