import { createContext, useContext, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
interface ComunidadesContextType {
  isInComunidades: boolean
  filtro: string | 'all'
  setFiltro: (f: string | 'all') => void
}
const ComunidadesContext = createContext<ComunidadesContextType | undefined>(
  undefined
)
export function ComunidadesProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isInComunidades =
    location.pathname === '/comunidades/comunidade-do-usuario'

  const [filtro, setFiltro] = useState<string | 'all'>('all')

  return (
    <ComunidadesContext.Provider
      value={{
        isInComunidades,
        filtro,
        setFiltro,
      }}
    >
      {children}
    </ComunidadesContext.Provider>
  )
}

export function useComunidades() {
  const context = useContext(ComunidadesContext)
  if (!context) {
    throw new Error('useComunidades must be used within ComunidadesProvider')
  }
  return context
}
