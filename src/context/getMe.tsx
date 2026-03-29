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
  isModerator: (communityId: number) => boolean
  isAdmin: (communityId: number) => boolean
  canManage: (communityId: number) => boolean
  refreshUser: () => Promise<void>
  isAuthLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const isMember = (communityId: number) => {
    return !!user?.communities?.[communityId]
  }

  const isModerator = (communityId: number) => {
    return user?.communities?.[communityId] === 'moderator'
  }

  const isAdmin = (communityId: number) => {
    return user?.communities?.[communityId] === 'admin'
  }

  const canManage = (communityId: number) => {
    const role = user?.communities?.[communityId]
    return role === 'admin' || role === 'moderator'
  }

  const [user, setUser] = useState<UserType | null>(null)
  const handleLogout = async () => {
    await logoutUser()

    setUser(null)

    navigate('/auth', { replace: true })
  }

  async function fetchUser() {
    setIsAuthLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: 'include',
      })
      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsAuthLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        handleLogout,
        isMember,
        isAdmin,
        isModerator,
        canManage,
        refreshUser: fetchUser,
        isAuthLoading,
      }}
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
