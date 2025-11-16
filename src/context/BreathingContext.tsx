import { createContext, useContext, useState, type ReactNode } from 'react'

const BreathingContext = createContext<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  Open: boolean
  typeBreathing: string
  setTypeBreathing: React.Dispatch<React.SetStateAction<string>>
}>(null as any)

const BreathingProvider = ({ children }: { children: ReactNode }) => {
  const [Open, setOpen] = useState(false)
  const [typeBreathing, setTypeBreathing] = useState('')
  return (
    <BreathingContext.Provider
      value={{ setOpen, Open, typeBreathing, setTypeBreathing }}
    >
      {children}
    </BreathingContext.Provider>
  )
}

export function useBreathing() {
  const context = useContext(BreathingContext)
  if (!context)
    throw new Error('useBreathing must be used within a BreathingProvider.')
  return context
}

export default BreathingProvider
