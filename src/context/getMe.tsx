// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { logoutUser } from '../services/authService'
import type { UserType } from '../types'

interface AuthContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  handleLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const handleLogout = async () => {
    const success = await logoutUser()
    if (success) setUser(null) // limpa o usuário globalmente
    window.location.href = '/auth'
  }
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: 'include', // envia o cookie HTTP-only
        })
        if (!res.ok) return setUser(null)
        const data = await res.json()
        setUser(data.user)
      } catch (error) {
        console.log(error)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook pra usar o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
