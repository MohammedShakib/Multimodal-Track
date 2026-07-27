import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  HardDrive,
  LogOut,
  Plus,
  RefreshCw,
  Server,
  Trash2,
  Users,
  X,
  XCircle,
  BarChart3,
  Shield,
} from 'lucide-react'
import useAuth from '../context/useAuth.js'
import { useNavigate } from '../lib/routerHooks.js'
import toast from 'react-hot-toast'

const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://multimodal-track-backend.onrender.com/api/v1'
const ADMIN_TOKEN = 'sadmin-secret-token'

const adminFetch = (path, options = {}) =>
  fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_TOKEN,
      ...options.headers,
    },
  })

// Stat Card
function StatCard({ icon: Icon, label, value, sub, accent, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: accent + '15',
            color: accent,
          }}
        >
          <Icon size={20} />
        </span>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {loading ? (
          <div style={{ height: '28px', width: '60%', borderRadius: '8px', background: '#f1f5f9', animation: 'pulse 1.5s infinite' }} />
        ) : (
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {value}
          </div>
        )}
        <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        {sub && (
          <div style={{ marginTop: '0.2rem', fontSize: '0.75rem', color: '#cbd5e1' }}>{sub}</div>
        )}
      </div>
    </motion.div>
  )
}

// DB Status Badge
function DbStatusBadge({ health, loading }) {
  if (loading) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
        <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
        Checking...
      </span>
    )
  }

  const connected = health?.database?.connected
  const configured = health?.database?.configured

  if (!configured) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '99px', padding: '0.3rem 0.8rem' }}>
        <XCircle size={13} />
        Not configured
      </span>
    )
  }

  if (connected) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#10b981', background: '#f0fdf4', border: '1px solid #d1fae5', borderRadius: '99px', padding: '0.3rem 0.8rem' }}>
        <CheckCircle2 size={13} />
        Connected
      </span>
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '99px', padding: '0.3rem 0.8rem' }}>
      <AlertTriangle size={13} />
      Disconnected
    </span>
  )
}

// Add User Modal
function AddUserModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '' })
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) { toast.error('Email required'); return }
    setSaving(true)
    try {
      const res = await adminFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('User added')
      onAdded()
      onClose()
    } catch {
      toast.error('Failed to add user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 24px 48px rgba(15,23,42,0.15)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Add User</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              style={{ width: '100%', height: '42px', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '0 0.875rem', fontSize: '0.9rem', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              required
              style={{ width: '100%', height: '42px', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '0 0.875rem', fontSize: '0.9rem', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, height: '42px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 1, height: '42px', background: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Main Page
export default function SuperAdminPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [health, setHealth] = useState(null)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [deletingEmail, setDeletingEmail] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Guard: only super admin
  useEffect(() => {
    if (!user?.isSuperAdmin) {
      navigate('/sign-in', { replace: true })
    }
  }, [user, navigate])

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true)
    try {
      const res = await adminFetch('/health')
      if (res.ok) setHealth(await res.json())
      else setHealth(null)
    } catch {
      setHealth(null)
    } finally {
      setLoadingHealth(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const res = await adminFetch('/stats')
      if (res.ok) setStats(await res.json())
    } catch {
      /* ignore */
    } finally {
      setLoadingStats(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const res = await adminFetch('/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
    fetchStats()
    fetchUsers()
  }, [fetchHealth, fetchStats, fetchUsers, refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)

  const deleteUser = async (email) => {
    if (!window.confirm(`Delete all data for "${email}"? This cannot be undone.`)) return
    setDeletingEmail(email)
    try {
      const res = await adminFetch(`/users/${encodeURIComponent(email)}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('User deleted')
        setUsers((prev) => prev.filter((u) => u.email !== email))
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setDeletingEmail(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const dbConnected = health?.database?.connected
  const dbConfigured = health?.database?.configured

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
      {/* Topbar */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#0f172a', color: '#fff' }}>
            <Shield size={16} />
          </span>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>Super Admin</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Multimodal Track</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <DbStatusBadge health={health} loading={loadingHealth} />
          <button
            type="button"
            onClick={refresh}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', height: '34px', padding: '0 0.85rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', height: '34px', padding: '0 0.85rem', background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard
            icon={Users}
            label="Unique Users"
            value={loadingStats ? '-' : stats?.uniqueUsers ?? '-'}
            accent="#3b82f6"
            loading={loadingStats}
          />
          <StatCard
            icon={BarChart3}
            label="Total Analyses"
            value={loadingStats ? '-' : stats?.totalAnalyses ?? '-'}
            accent="#10b981"
            loading={loadingStats}
          />
          <StatCard
            icon={HardDrive}
            label="Storage Used"
            value={loadingStats ? '-' : formatBytes(stats?.totalImageSizeBytes)}
            accent="#8b5cf6"
            loading={loadingStats}
          />
          <StatCard
            icon={Clock}
            label="Last Activity"
            value={loadingStats ? '-' : (stats?.latestActivity ? new Date(stats.latestActivity).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'None')}
            sub={!loadingStats && stats?.latestActivity ? new Date(stats.latestActivity).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : undefined}
            accent="#f59e0b"
            loading={loadingStats}
          />
        </div>

        {/* Server Info & DB Status */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Server size={16} color="#0f172a" />
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>System Status</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* Database */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                <Database size={11} /> Database
              </div>
              {loadingHealth ? (
                <div style={{ height: '16px', width: '70%', borderRadius: '6px', background: '#e2e8f0' }} />
              ) : (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: dbConnected ? '#10b981' : dbConfigured ? '#ef4444' : '#94a3b8' }}>
                  {!dbConfigured ? 'Not configured' : dbConnected ? 'PostgreSQL connected' : 'Connection failed'}
                </div>
              )}
              {!loadingHealth && health?.database?.error && (
                <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: '#ef4444' }}>{health.database.error}</div>
              )}
            </div>

            {/* Uptime */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Uptime</div>
              {loadingHealth ? (
                <div style={{ height: '16px', width: '50%', borderRadius: '6px', background: '#e2e8f0' }} />
              ) : (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {health?.uptime != null ? `${Math.floor(health.uptime / 60)}m ${health.uptime % 60}s` : '-'}
                </div>
              )}
            </div>

            {/* Memory */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Heap Memory</div>
              {loadingHealth ? (
                <div style={{ height: '16px', width: '40%', borderRadius: '6px', background: '#e2e8f0' }} />
              ) : (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {health?.memoryMB != null ? `${health.memoryMB} MB` : '-'}
                </div>
              )}
            </div>

            {/* Node version */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Node.js</div>
              {loadingHealth ? (
                <div style={{ height: '16px', width: '40%', borderRadius: '6px', background: '#e2e8f0' }} />
              ) : (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{health?.nodeVersion ?? '-'}</div>
              )}
            </div>

            {/* Server time */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Server Time</div>
              {loadingHealth ? (
                <div style={{ height: '16px', width: '70%', borderRadius: '6px', background: '#e2e8f0' }} />
              ) : (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {health?.serverTime ? new Date(health.serverTime).toLocaleTimeString('en-GB') : '-'}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}
        >
          {/* Table header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} color="#0f172a" />
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Users
              </h2>
              <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '0.15rem 0.55rem', borderRadius: '99px' }}>
                {loadingUsers ? '...' : users.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', height: '34px', padding: '0 0.875rem', background: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
            >
              <Plus size={13} />
              Add User
            </button>
          </div>

          {/* Table body */}
          {loadingUsers ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
              <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem' }} />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Users size={36} color="#e2e8f0" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>No users yet</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                {dbConfigured ? 'Users who upload boards will appear here.' : 'Connect a database to see users.'}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Name', 'Email', 'Analyses', 'First Active', 'Last Active', ''].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', borderBottom: '1px solid #f1f5f9' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((u, i) => (
                      <motion.tr
                        key={u.email}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: '1px solid #f8fafc' }}
                      >
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', flexShrink: 0 }}>
                              {(u.name || u.email || '?')[0].toUpperCase()}
                            </span>
                            {u.name || '-'}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>{u.email}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                          <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '6px', padding: '0.2rem 0.5rem' }}>{u.total_analyses}</span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(u.first_active)}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(u.last_active)}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <button
                            type="button"
                            onClick={() => deleteUser(u.email)}
                            disabled={deletingEmail === u.email}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', height: '30px', padding: '0 0.65rem', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer', opacity: deletingEmail === u.email ? 0.5 : 1 }}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdded={refresh}
          />
        )}
      </AnimatePresence>

      {/* CSS for loading animations */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
