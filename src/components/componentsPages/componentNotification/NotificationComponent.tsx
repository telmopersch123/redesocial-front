import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  MessageCircle,
  Users,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import { useCriarPostDialog } from '../../../context/ContextDialogPost'
import type { Notification } from '../../../context/NotificationProvider'
import { useNotification } from '../../../context/NotificationProvider'

const iconForType = {
  MESSAGE: <MessageCircle className="h-4 w-4 text-blue-700" />,
  LIKE: <Heart className="h-4 w-4 text-purple-700" />, // FEITO
  COMMENT: <MessageCircle className="h-4 w-4 text-green-700" />, // FEITO
  // FOLLOW_REQUEST: <Users className="h-4 w-4 text-gray-500" />,
  COMMENT_REPLY: <MessageCircle className="h-4 w-4 text-gray-700" />, // FEITO
  // MENTION: <AtSign className="h-4 w-4 text-purple-500" />,
  COMMUNITY_REMOVE: <Users className="h-4 w-4 text-red-700" />,
}

const NotificationComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotification()
  const { setOpenDialogPostNotification, setOpenActionPosts } =
    useCriarPostDialog()

  const activeNotifications = notifications.filter((n) => !n.read)
  console.log(unreadCount)
  const handleNotificationClick = async (n: Notification) => {
    await markAsRead(n.id)

    if (n.type === 'LIKE' || n.type === 'COMMENT') {
      setOpenActionPosts(true)
      setOpenDialogPostNotification(true)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-colors hover:bg-accent/50"
        >
          <Bell className="h-[1.2rem] w-[1.2rem] text-purple-600 transition-all group-hover:scale-110 dark:text-purple-400" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? '+9' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 overflow-hidden rounded-xl border-border bg-background p-0 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
          <h3 className="text-sm font-bold text-foreground">Notificações</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAsRead('all')}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 transition-colors hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* List */}
        <div className="custom-scrollbar max-h-[350px] overflow-y-auto overflow-x-hidden py-1">
          {activeNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground/40">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Tudo em dia!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Você não tem novas notificações no momento.
              </p>
            </div>
          ) : (
            activeNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="group relative flex cursor-pointer items-start gap-3 border-b border-border/40 px-4 py-4 transition-all last:border-0 hover:bg-accent/60"
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-muted/50 p-2 transition-colors group-hover:bg-background">
                  {iconForType[n.type as keyof typeof iconForType]}
                </div>

                <div className="flex flex-col space-y-1 pr-6">
                  <span className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {n.message}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Botão de lida individual (estilo "Done") */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(n.id)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-transparent p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-purple-100 hover:text-purple-600 group-hover:opacity-100 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
                  title="Marcar como lida"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationComponent
