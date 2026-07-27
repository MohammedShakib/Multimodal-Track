import { useContext, useEffect, useMemo, useState } from 'react'
import RouterContext from './routerContext.js'

export function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const value = useMemo(
    () => ({
      pathname,
      navigate: (to, options = {}) => {
        if (to === window.location.pathname) return
        if (options.replace) {
          window.history.replaceState({}, '', to)
        } else {
          window.history.pushState({}, '', to)
        }
        setPathname(to)
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
      href={to}
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
