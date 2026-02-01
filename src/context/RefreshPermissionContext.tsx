import { createContext, useContext, useState, type ReactNode } from 'react'

interface RefreshPermissionContextType {
  refreshTrigger: number
  triggerRefresh: () => void
}

const RefreshPermissionContext = createContext<
  RefreshPermissionContextType | undefined
>(undefined)

export function RefreshPermissionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  function triggerRefresh() {
    setRefreshTrigger((prev) => prev + 1)
  }
  return (
    <RefreshPermissionContext.Provider
      value={{ refreshTrigger, triggerRefresh }}
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
