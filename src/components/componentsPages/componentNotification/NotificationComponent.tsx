import {
  AtSign,
  Bell,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
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
import type { Notification } from '../../../context/NotificationProvider'
import { useNotification } from '../../../context/NotificationProvider'
import {
  AcceptFriendship,
  DeclineFriendship,
} from '../../../services/authService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'

const iconForType = {
  MESSAGE: <MessageCircle className="h-4 w-4 text-blue-700" />, // FEITO
  LIKE: <Heart className="h-4 w-4 text-purple-700" />, // FEITO
  COMMENT: <MessageCircle className="h-4 w-4 text-green-700" />, // FEITO
  FOLLOW_REQUEST: <Users className="h-4 w-4 text-gray-500" />,
  COMMENT_REPLY: <MessageCircle className="h-4 w-4 text-gray-700" />, // FEITO
  MENTION: <AtSign className="h-4 w-4 text-purple-500" />, // FEITO
  COMMUNITY_REMOVE: <Users className="h-4 w-4 text-red-700" />, // FEITO
}

const NotificationComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotification()

  const { setOpenDialogPostNotification, setOpenActionPosts } =
    useCriarPostDialog()
  const activeNotifications = notifications.filter((n) => !n.read)
  const msgNotifications = activeNotifications.filter(
    (n) => n.type === 'MESSAGE'
  )
  const interactionNotifications = activeNotifications.filter((m) =>
    ['LIKE', 'COMMENT', 'COMMENT_REPLY', 'MENTION'].includes(m.type)
  )

  const communitNotifications = activeNotifications.filter(
    (n) => n.type === 'COMMUNITY_REMOVE'
  )

  const abaNotifUsers = activeNotifications.filter((n) =>
    ['FOLLOW_REQUEST', 'FRIEND_ACCEPT'].includes(n.type)
  )

  const countedChats = msgNotifications.length
  const countedSocial = interactionNotifications.length
  const countedCom = communitNotifications.length
  const countedUsers = abaNotifUsers.length

  const handleNotificationClick = async (n: Notification) => {
    await markAsRead(n.id)

    if (['LIKE', 'COMMENT', 'MENTION', 'COMMENT_REPLY'].includes(n.type)) {
      setOpenActionPosts(true)
      setOpenDialogPostNotification(true)
    }
  }

  const handleAcceptFriendship = async (n: Notification) => {
    try {
      await AcceptFriendship(n.id)
      handleNotificationClick(n)
    } catch {
      console.log('Erro ao aceitar amizade')
    }
  }
  const handleDeclineFriendship = async (n: Notification) => {
    try {
      await DeclineFriendship(n.id)
      handleNotificationClick(n)
    } catch {
      console.log('Erro ao aceitar amizade')
    }
  }

  const NotificationList = ({ items }: { items: Notification[] }) => {
    const grouped = items.reduce(
      (acc, n) => {
        let groupKey = n.type
        if (n.type === 'COMMUNITY_REMOVE') {
          groupKey = `SINGLE_NOTIF_${n.id}`
        } else if (n.type === 'MESSAGE' && n.link) {
          groupKey = `CHAT_${n.link}`
        } else if (n.type === 'FOLLOW_REQUEST' || n.type === 'FRIEND_ACCEPT') {
          groupKey = `SINGLE_FOLLREQUEST_${n.id}`
        }
        if (!acc[groupKey]) acc[groupKey] = []
        acc[groupKey].push(n)
        return acc
      },
      {} as Record<string, Notification[]>
    )

    const [expandedGroups, setExpandedGroups] = useState<string[]>([])

    const toggleGroup = (type: string) => {
      setExpandedGroups((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      )
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center text-muted-foreground">
          <p className="text-sm font-medium">Nada por aqui!</p>
        </div>
      )
    }
    return (
      <div className="custom-scrollbar max-h-[350px] overflow-y-auto overflow-x-hidden">
        {Object.entries(grouped).map(([type, groupItems]) => {
          const isCommunityRemove = groupItems[0].type === 'COMMUNITY_REMOVE'
          const isFollowers = groupItems[0].type === 'FOLLOW_REQUEST'
          const isFriendAccept = groupItems[0].type === 'FRIEND_ACCEPT'
          if (
            groupItems.length === 1 ||
            isCommunityRemove ||
            isFollowers ||
            isFriendAccept
          ) {
            const n = groupItems[0]
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (!isFollowers) {
                    handleNotificationClick(n)
                  }
                }}
                className="group relative flex cursor-pointer items-start gap-3 border-b border-border/40 px-4 py-4 transition-all hover:bg-accent/60"
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-muted/50 p-2 group-hover:bg-background">
                  {iconForType[n.type as keyof typeof iconForType]}
                </div>
                <div className="flex flex-col space-y-1 pr-6">
                  <span className="text-sm font-medium leading-snug text-foreground group-hover:text-purple-600">
                    {n.message}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isFollowers && (
                    <div
                      className="mt-3 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        onClick={() => handleAcceptFriendship(n)}
                        className="h-6 w-14 bg-purple-600 px-4 text-xs font-bold text-white hover:bg-purple-700"
                      >
                        Aceitar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeclineFriendship(n)}
                        className="h-6 w-14 border-rose-200 px-4 text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/30 dark:hover:bg-rose-900/20"
                      >
                        Recusar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          const isExpanded = expandedGroups.includes(type)
          const isChat = type.startsWith('CHAT_')
          const labelRaw = isChat
            ? `${groupItems[0].message.split(':')[0]}`
            : {
                LIKE: 'Curtidas',
                COMMENT: 'Comentários',
                COMMENT_REPLY: 'Respostas',
                MESSAGE: 'Mensagens',
                COMMUNITY_REMOVE: 'Comunidade',
                MENTION: 'Menções',
              }[groupItems[0].type] || 'Notificações'
          const label =
            labelRaw.length > 15 ? `${labelRaw.substring(0, 15)}...` : labelRaw
          return (
            <div key={type} className="border-b border-border/40 last:border-0">
              {/* Cabeçalho do Grupo */}
              <button
                onClick={() => toggleGroup(type)}
                className="flex w-full items-center justify-between bg-muted/10 px-4 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <div className="opacity-70">
                    {iconForType[type as keyof typeof iconForType]}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {label} ({groupItems.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {/* Itens do Grupo (Só aparecem se expandido) */}
              {isExpanded && (
                <div className="bg-background/50">
                  {groupItems.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className="group relative flex cursor-pointer items-start gap-3 border-l-2 border-transparent px-6 py-3 transition-all hover:border-purple-500 hover:bg-accent/40"
                    >
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-sm leading-snug text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {n.message}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid h-10 w-full grid-cols-4 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="chats"
              className="rounded-none text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
            >
              Bate-Papo{' '}
              {countedChats > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {countedChats}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-none text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
            >
              Interações{' '}
              {countedSocial > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {countedSocial}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="com"
              className="rounded-none text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
            >
              Comunidades{' '}
              {countedCom > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {countedCom}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="user"
              className="rounded-none text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
            >
              Social{' '}
              {countedUsers > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {countedUsers}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="m-0">
            <NotificationList items={msgNotifications} />
          </TabsContent>

          <TabsContent value="social" className="m-0">
            <NotificationList items={interactionNotifications} />
          </TabsContent>

          <TabsContent value="com" className="m-0">
            <NotificationList items={communitNotifications} />
          </TabsContent>

          <TabsContent value="user" className="m-0">
            <NotificationList items={abaNotifUsers} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationComponent
