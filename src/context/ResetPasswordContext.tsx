import { createContext, useContext, useState, type ReactNode } from 'react'

type ResetPasswordContextData = {
  email: string
  code: string

  messageConfirm: boolean
  setEmail: (email: string) => void
  setCode: (code: string) => void

  setMessageConfirm: (message: boolean) => void
  clear: () => void
  setIsLoading: (isLoading: boolean) => void
  isLoading: boolean
}

const ResetPasswordContext = createContext<ResetPasswordContextData | null>(
  null
)

export function ResetPasswordProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const [messageConfirm, setMessageConfirm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function clear() {
    setEmail('')
    setCode('')
  }

  return (
    <ResetPasswordContext.Provider
      value={{
        email,
        code,

        messageConfirm,
        setEmail,
        setCode,
        setMessageConfirm,

        clear,
        setIsLoading,
        isLoading,
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
