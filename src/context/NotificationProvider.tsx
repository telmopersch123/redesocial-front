import { createContext, useContext, useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { socket } from '../services/socket'
import { AlertCommunityRoleToast } from '../utils/components/alertToast'
import { useAuth } from './getMe'

interface Notification {
  id: number
  message: string
  type: 'DEMOTION' | 'PROMOTION'
  read: boolean
  createdAt: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: number) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const loadNotifications = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/notifications`,
        {
          credentials: 'include',
        }
      )
      const data = await res.json()
      setNotifications(data)

      // Se o cara logar e tiver uma promoção não lida, manda o Toast
      const unreadProm = data.find(
        (n: Notification) => n.type === 'PROMOTION' && !n.read
      )
      if (unreadProm) {
        toast.custom((t) => (
          <AlertCommunityRoleToast
            type={unreadProm.type}
            message={unreadProm.message}
            onAction={() => {
              markAsRead(unreadProm.id)
              toast.dismiss(t.id)
            }}
          />
        ))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/notifications/${id}/read`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user?.id) loadNotifications()
  }, [user?.id])

  useEffect(() => {
    if (!socket) return

    const handleIncoming = (data: Notification) => {
      setNotifications((prev) => [data, ...prev])
      console.log(data)
      if (data.type === 'PROMOTION' || data.type === 'DEMOTION') {
        toast.custom((t) => (
          <AlertCommunityRoleToast
            type={data.type}
            message={data.message}
            onAction={() => {
              markAsRead(data.id)
              toast.dismiss(t.id)
            }}
          />
        ))
      }
    }

    // Certifique-se de que o nome do evento aqui é o mesmo que você deu no console.log
    socket.on('notification:promotion', handleIncoming)
    socket.on('notification:demotion', handleIncoming)
    socket.on('notification:new', handleIncoming) // Caso você tenha unificado

    return () => {
      socket.off('notification:promotion')
      socket.off('notification:demotion')
      socket.off('notification:new')
    }
  }, [socket])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx)
    throw new Error('useNotification must be inside NotificationProvider')
  return ctx
}
