import { createContext, useContext, useState, type ReactNode } from 'react'

type ResetPasswordContextData = {
  email: string
  code: string
  token: string | undefined
  messageConfirm: boolean
  setEmail: (email: string) => void
  setCode: (code: string) => void
  setToken: (token: string | undefined) => void
  setMessageConfirm: (message: boolean) => void
  clear: () => void
  setIsLoading: (isLoading: boolean) => void
  isLoading: boolean
  setRegisterToken: React.Dispatch<React.SetStateAction<string | null>>
  registerToken: string | null
}

const ResetPasswordContext = createContext<ResetPasswordContextData | null>(
  null
)

export function ResetPasswordProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [token, setToken] = useState<string | undefined>('')
  const [messageConfirm, setMessageConfirm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [registerToken, setRegisterToken] = useState<string | null>(null)

  function clear() {
    setEmail('')
    setCode('')
    setToken(undefined)
  }

  return (
    <ResetPasswordContext.Provider
      value={{
        email,
        code,
        token,
        messageConfirm,
        setEmail,
        setCode,
        setMessageConfirm,
        setToken,
        clear,
        setIsLoading,
        isLoading,
        registerToken,
        setRegisterToken,
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
