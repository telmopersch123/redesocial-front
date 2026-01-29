import { createContext, useContext, useState, type ReactNode } from 'react'
interface ComunidadesContextType {
  filtro: number | 'all'
  setFiltro: (f: number | 'all') => void
}
const ComunidadesContext = createContext<ComunidadesContextType | undefined>(
  undefined
)
export function ComunidadesProvider({ children }: { children: ReactNode }) {
  const [filtro, setFiltro] = useState<number | 'all'>('all')

  return (
    <ComunidadesContext.Provider
      value={{
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
