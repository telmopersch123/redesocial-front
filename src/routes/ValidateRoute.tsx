import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/getMe'
import { LoadingComponent } from '../utils/components/Loading'

export function ValidateRoute() {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingComponent />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
