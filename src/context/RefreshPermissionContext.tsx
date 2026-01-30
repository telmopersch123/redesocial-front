import { createContext, useContext, useState, type ReactNode } from 'react'

interface RefreshPermissionContextType {
  permissionRefresh: boolean
  allowRefresh: () => void
  resetRefresh: () => void
}

const RefreshPermissionContext = createContext<
  RefreshPermissionContextType | undefined
>(undefined)

export function RefreshPermissionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [permissionRefresh, setPermissionRefresh] = useState(false)

  function allowRefresh() {
    setPermissionRefresh(true)
  }

  function resetRefresh() {
    setPermissionRefresh(false)
  }

  return (
    <RefreshPermissionContext.Provider
      value={{ permissionRefresh, allowRefresh, resetRefresh }}
    >
      {children}
    </RefreshPermissionContext.Provider>
  )
}

export function useRefreshPermission() {
  const context = useContext(RefreshPermissionContext)
  if (!context) {
    throw new Error(
      'useRefreshPermission deve ser usado dentro de RefreshPermissionProvider'
    )
  }
  return context
}
