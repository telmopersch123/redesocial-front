// src/context/CriarPostDialogContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

interface CriarPostDialogContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  postCommunity: boolean
  setPostCommunity: React.Dispatch<React.SetStateAction<boolean>>
  setOpenDialogPostNotification: React.Dispatch<React.SetStateAction<boolean>>
  openDialogPostNotification: boolean
  setOpenNotification: React.Dispatch<React.SetStateAction<boolean>>
  openNotification: boolean
}

const CriarPostDialogContext = createContext<
  CriarPostDialogContextType | undefined
>(undefined)

export function CriarPostDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [postCommunity, setPostCommunity] = useState<boolean>(false)
  const [openDialogPostNotification, setOpenDialogPostNotification] =
    useState(false)
  const [openNotification, setOpenNotification] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <CriarPostDialogContext.Provider
      value={{
        isOpen,
        open,
        close,
        postCommunity,
        setPostCommunity,
        setOpenDialogPostNotification,
        openDialogPostNotification,
        setOpenNotification,
        openNotification,
      }}
    >
      {children}
    </CriarPostDialogContext.Provider>
  )
}

export function useCriarPostDialog() {
  const context = useContext(CriarPostDialogContext)
  if (!context)
    throw new Error(
      'useCriarPostDialog must be used within CriarPostDialogProvider'
    )
  return context
}
