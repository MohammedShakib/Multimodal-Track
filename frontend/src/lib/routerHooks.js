import { useContext } from 'react'
import RouterContext from './routerContext.js'

function useRouter() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('Router hooks must be used inside RouterProvider')
  }
  return context
}

export function usePathname() {
  return useRouter().pathname
}

export function useNavigate() {
  return useRouter().navigate
}
