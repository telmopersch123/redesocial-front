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

      const unreadAlerts = data.filter(
        (n: Notification) =>
          (n.type === 'PROMOTION' || n.type === 'DEMOTION') && !n.read
      )

      unreadAlerts.forEach((n: Notification) => {
        showRoleToast(n)
        markAsRead(n.id)
      })
    } catch (err) {
      console.error(err)
    }
  }

  const showRoleToast = (n: Notification) => {
    toast.custom(
      (t) => (
        <AlertCommunityRoleToast
          visible={t.visible}
          type={n.type as 'PROMOTION' | 'DEMOTION'}
          message={n.message}
          onAction={() => {
            markAsRead(n.id)
            toast.dismiss(t.id)
          }}
        />
      ),
      { duration: 6000 }
    ) // Define um tempo para sumir
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
      if (data.type === 'PROMOTION' || data.type === 'DEMOTION') {
        showRoleToast(data)
        markAsRead(data.id)
      }
    }

    socket.on('notification:new', handleIncoming)
    return () => {
      socket.off('notification:new')
    }
  }, [socket])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      toast.dismiss()
    }
  }, [user])

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
