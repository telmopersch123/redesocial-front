import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'

interface AdminUser {
  id: number
  username: string
}

interface AdminContextType {
  admin: AdminUser | null
  loading: boolean
  logout: () => Promise<void>
  refreshAdmin: () => Promise<void>
  setAdmin: React.Dispatch<React.SetStateAction<AdminUser | null>>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAdmin = async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/admin/getAd`,
        {
          credentials: 'include',
        }
      )

      if (res.ok) {
        const data = await res.json()
        setAdmin(data)
      } else {
        setAdmin(null)
      }
    } catch {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setAdmin(null)
    navigate('/admin/login')
  }

  useEffect(() => {
    fetchAdmin()
  }, [])

  return (
    <AdminContext.Provider
      value={{ admin, loading, logout, refreshAdmin: fetchAdmin, setAdmin }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminContext)
  if (!context)
    throw new Error('useAdminAuth deve ser usado dentro de um AdminProvider')
  return context
}
