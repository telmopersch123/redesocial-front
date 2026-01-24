// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'
import type { UserType } from '../types'

interface AuthContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  handleLogout: () => Promise<void>
  isMember: (communityId: number) => boolean
  isAdmin: (communityId: number) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()

  const isMember = (communityId: number) => {
    return !!user?.communities?.[communityId]
  }

  const isAdmin = (communityId: number) => {
    return user?.communities?.[communityId] === 'admin'
  }

  const [user, setUser] = useState<UserType | null>(null)
  const handleLogout = async () => {
    await logoutUser()

    setUser(null)

    navigate('/auth', { replace: true })
  }
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: 'include', // envia o cookie HTTP-only
        })
        if (!res.ok) {
          setUser(null)
          return
        }
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, setUser, handleLogout, isMember, isAdmin }}
    >
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
