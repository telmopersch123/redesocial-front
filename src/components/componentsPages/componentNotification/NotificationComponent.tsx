import {
  AtSign,
  Bell,
  Heart,
  MessageCircle,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import { useCriarPostDialog } from '../../../context/ContextDialogPost'

type Notification = {
  id: number
  type:
    | 'message'
    | 'like'
    | 'comment'
    | 'mention'
    | 'community_add'
    | 'community_remove'
  text: string
  time: string
  read: boolean
}

const iconForType = {
  message: <MessageCircle className="h-4 w-4 text-blue-500" />,
  like: <Heart className="h-4 w-4 text-red-500" />,
  comment: <MessageCircle className="h-4 w-4 text-green-500" />,
  mention: <AtSign className="h-4 w-4 text-purple-500" />,
  community_add: <UserPlus className="h-4 w-4 text-yellow-500" />,
  community_remove: <Users className="h-4 w-4 text-gray-500" />,
}

const NotificationComponent = () => {
  const { setOpenDialogPostNotification, setOpenActionPosts } =
    useCriarPostDialog()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'message',
      text: 'Você recebeu uma nova mensagem',
      time: '2 min atrás',
      read: false,
    },
    {
      id: 2,
      type: 'like',
      text: 'Maria curtiu seu post',
      time: '10 min atrás',
      read: false,
    },
    {
      id: 3,
      type: 'mention',
      text: 'Você foi mencionado em um comentário',
      time: '1 hora atrás',
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications([])
  }

  const handleRemoveNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative hover:bg-transparent">
          <Bell
            className="!h-6 !w-6 text-purple-600 dark:text-purple-400"
            style={{
              filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))',
            }}
          />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 overflow-hidden rounded-xl p-0 shadow-xl animate-in fade-in slide-in-from-top-2"
      >
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="text-sm font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-purple-600 hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="max-h-80 space-y-2 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              Nenhuma notificação
            </p>
          ) : (
            notifications.map((n) => (
              <div
                onClick={() => handleRemoveNotification(n.id)}
                key={n.id}
                className={`relative flex cursor-pointer items-start gap-3 rounded-lg border transition-all`}
              >
                <div
                  className="w-full p-3"
                  onClick={() => {
                    setOpenActionPosts(true)
                    setOpenDialogPostNotification(true)
                  }}
                >
                  <div className="mt-1">{iconForType[n.type]}</div>

                  <div className="flex flex-col">
                    <span className="text-sm">{n.text}</span>
                    <span className="text-xs text-gray-500">{n.time}</span>
                  </div>
                </div>
                <div
                  onClick={() => handleRemoveNotification(n.id)}
                  className="absolute right-1 top-1 rounded-md bg-red-600 p-2 transition-colors hover:bg-red-400"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationComponent
