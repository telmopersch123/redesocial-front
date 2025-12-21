import { createContext, useContext, useState, type ReactNode } from 'react'

type ResetPasswordContextData = {
  email: string
  code: string
  setEmail: (email: string) => void
  setCode: (code: string) => void
  clear: () => void
}

const ResetPasswordContext = createContext<ResetPasswordContextData | null>(
  null
)

export function ResetPasswordProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  function clear() {
    setEmail('')
    setCode('')
  }

  return (
    <ResetPasswordContext.Provider
      value={{
        email,
        code,
        setEmail,
        setCode,
        clear,
      }}
    >
      {children}
    </ResetPasswordContext.Provider>
  )
}

export function useResetPassword() {
  const context = useContext(ResetPasswordContext)

  if (!context) {
    throw new Error(
      'useResetPassword must be used within a ResetPasswordProvider'
    )
  }

  return context
}
