import { useContext, useEffect, useMemo, useState } from 'react'
import RouterContext from './routerContext.js'

function normalizePath(path) {
  if (!path || path === '#') return '/'
  const withoutHash = path.startsWith('#') ? path.slice(1) : path
  return withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`
}

function getCurrentPathname() {
  if (window.location.hash.startsWith('#/')) {
    return normalizePath(window.location.hash)
  }

  return normalizePath(window.location.pathname)
}

function pathToUrl(path) {
  const normalizedPath = normalizePath(path)
  return normalizedPath === '/' ? '/' : `/#${normalizedPath}`
}

export function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(getCurrentPathname)

  useEffect(() => {
    const handleLocationChange = () => setPathname(getCurrentPathname())

    window.addEventListener('hashchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const value = useMemo(
    () => ({
      pathname,
      navigate: (to, options = {}) => {
        const nextPathname = normalizePath(to)
        if (nextPathname === getCurrentPathname()) return

        const nextUrl = pathToUrl(nextPathname)
        if (options.replace) {
          window.history.replaceState({}, '', nextUrl)
        } else {
          window.history.pushState({}, '', nextUrl)
        }
        setPathname(nextPathname)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
    }),
    [pathname],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function Link({ to, children, ...props }) {
  const { navigate } = useRouter()

  return (
    <a
      href={pathToUrl(to)}
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return
        }
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

function useRouter() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('Router hooks must be used inside RouterProvider')
  }
  return context
}
