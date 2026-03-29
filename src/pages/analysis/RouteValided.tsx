import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/getad'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const RouteValided = ({ children }: ProtectedRouteProps) => {
  const { admin, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <span className="ml-3">Verificando autenticação...</span>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/analysisLo" state={{ from: location }} replace />
  }

  return <>{children}</>
}
