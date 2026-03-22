import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export const RouteLoa = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = { role: 'SUPPORT' }
  const loading = false
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/analysisLo" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
