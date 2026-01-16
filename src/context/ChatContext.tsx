import { createContext, useContext, useEffect, useState } from 'react'

import { getContatos } from '../services/authService'
import { socket } from '../services/socket'
import { useAuth } from './getMe'

export interface MSG {
  id: string
  tempId?: string
  chatId?: string
  content: string
  senderId: number
  remetente: 'eu' | 'outro'
  createdAt: Date
  receiverId?: number
  readAt?: Date
  deliveredAt?: Date
  status?: 'pending' | 'sent'
  senderName: string
}
export interface Contato {
  chatId: string
  contact: {
    id: number
    name_at: string
    avatar: string
  }
  lastMessage: {
    id: string
    createdAt: Date
    chatId: string
    senderId: number
    receiverId?: number
    content: string
    readAt?: Date | undefined | null
  }
  unreadMessages?: number
  lastMessageReadStatus: boolean
  createdAt: string
}
export interface IncomingMessage {
  id: string
  chatId: string
  content: string
  senderId: number
  createdAt: Date
  tempId?: string
  deliveredAt?: Date
  readAt?: Date
  senderName: string
}

interface ChatContextType {
  resetChatState: () => void
  messagesByChat: Record<string, MSG[]>
  setMessagesByChat: React.Dispatch<React.SetStateAction<Record<string, MSG[]>>>
  contatos: Contato[]
  setContatos: React.Dispatch<React.SetStateAction<Contato[]>>
  selectedChat: string | null
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>
  onlineUsers: Set<number>
  isChatOpen: boolean
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
  lastCreatedChatId: string | null
  setCursorByChat: React.Dispatch<
    React.SetStateAction<Record<string, string | null>>
  >
  cursorByChat: Record<string, string | null>
  loadingHistoryByChat: Record<string, boolean>
  loadingHistoryInitial: Record<string, boolean>
  setLastCreatedChatId: React.Dispatch<React.SetStateAction<string | null>>
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [cursorByChat, setCursorByChat] = useState<
    Record<string, string | null>
  >({})
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messagesByChat, setMessagesByChat] = useState<Record<string, MSG[]>>(
    {}
  )
  const [lastCreatedChatId, setLastCreatedChatId] = useState<string | null>(
    null
  )
  const [loadingHistoryByChat, setLoadingHistoryByChat] = useState<
    Record<string, boolean>
  >({})
  const [loadingHistoryInitial, setLoadingHistoryInitial] = useState<
    Record<string, boolean>
  >({})

  const [contatos, setContatos] = useState<Contato[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set())
  const [isChatOpen, setIsChatOpen] = useState(false)
  const resetChatState = () => {
    setMessagesByChat({})
    setCursorByChat({})
    setSelectedChat(null)
  }

  useEffect(() => {
    const handleReactivated = async () => {
      const response = await getContatos()
      setContatos(response)
    }

    socket.on('chat:reactivated', handleReactivated)

    return () => {
      socket.off('chat:reactivated', handleReactivated)
    }
  }, [])
  useEffect(() => {
    const handleDelivered = ({
      chatId,
      messageId,
      deliveredAt,
    }: {
      chatId: string
      messageId: string
      deliveredAt: Date
    }) => {
      if (!messageId?.length) return
      setMessagesByChat((prev) => {
        const updated = { ...prev }

        const list = updated[chatId] ?? []
        updated[chatId] = list.map((msg) =>
          messageId.includes(msg.id) ? { ...msg, deliveredAt } : msg
        )
        return updated
      })
    }

    socket.on('message:delivered', handleDelivered)

    return () => {
      socket.off('message:delivered', handleDelivered)
    }
  }, [])
  useEffect(() => {
    const handleHistory = ({
      chatId,
      messages,
      nextCursor,
      loading,
      loadingInitial,
    }: {
      chatId: string
      messages: MSG[]
      nextCursor?: string
      loading: boolean
      loadingInitial: boolean
    }) => {
      setLoadingHistoryByChat((prev) => ({
        ...prev,
        [chatId]: loading,
      }))
      setLoadingHistoryInitial((prev) => ({
        ...prev,
        [chatId]: loadingInitial,
      }))
      if (messages?.length) {
        setMessagesByChat((prev) => {
          const existing = prev[chatId] ?? []
          const existingIds = new Set(existing.map((m) => m.id))
          const normalized: MSG[] = messages
            .filter((m) => !existingIds.has(m.id))
            .map((msg) => ({
              ...msg,
              // garante Date real (Socket manda string)
              createdAt: new Date(msg.createdAt),
              readAt: msg.readAt ? new Date(msg.readAt) : undefined,
              deliveredAt: msg.deliveredAt
                ? new Date(msg.deliveredAt)
                : undefined,
              // define corretamente quem enviou
              remetente: msg.senderId === Number(user?.id) ? 'eu' : 'outro',
            }))

          return {
            ...prev,
            [chatId]: [...normalized, ...existing],
          }
        })
      }
      if (nextCursor) {
        setCursorByChat((prev) => ({
          ...prev,
          [chatId]: nextCursor ?? null,
        }))
      }
    }

    socket.on('chat:history', handleHistory)

    return () => {
      socket.off('chat:history', handleHistory)
    }
  }, [user?.id])
  useEffect(() => {
    const handleReceive = (msg: IncomingMessage) => {
      if (!msg.chatId) return

      setMessagesByChat((prev) => {
        const list = prev[msg.chatId] ?? []

        // BLINDAGEM CONTRA DUPLICAÇÃO
        const exists = list.some((m) => m.id === msg.id)
        if (exists) return prev

        const normalized: MSG = {
          ...msg,
          chatId: msg.chatId,
          createdAt: new Date(msg.createdAt),
          readAt: msg.readAt ? new Date(msg.readAt) : undefined,
          deliveredAt: msg.deliveredAt ? new Date(msg.deliveredAt) : undefined,
          remetente: msg.senderId === Number(user?.id) ? 'eu' : 'outro',
        }

        return {
          ...prev,
          [msg.chatId]: [...list, normalized],
        }
      })
    }

    socket.on('message:receive', handleReceive)

    return () => {
      socket.off('message:receive', handleReceive)
    }
  }, [user?.id, selectedChat, isChatOpen])
  useEffect(() => {
    const handleSent = (msg: IncomingMessage) => {
      if (!msg.chatId) return
      setMessagesByChat((prev) => {
        const list = prev[msg.chatId] ?? []

        if (!list || list.length === 0) {
          socket.emit('chat:history', {
            chatId: msg.chatId,
            typeSearch: 'initial',
          })
          return prev
        }

        return {
          ...prev,
          [msg.chatId]: list.map((m) =>
            m.tempId === msg.tempId ? { ...m, ...msg, status: 'sent' } : m
          ),
        }
      })

      if (!selectedChat) {
        setLastCreatedChatId(msg.chatId)
        setSelectedChat(msg.chatId)
      }
    }

    socket.on('message:sent', handleSent)

    return () => {
      socket.off('message:sent', handleSent)
    }
  }, [])
  useEffect(() => {
    const handleBulkDelivered = ({
      chats,
      deliveredAt,
    }: {
      chats: Record<string, string[]>
      deliveredAt: string
    }) => {
      const date = new Date(deliveredAt)

      setMessagesByChat((prev) => {
        const updated = { ...prev }

        for (const chatId in chats) {
          const ids = chats[chatId]
          const list = updated[chatId] ?? []

          updated[chatId] = list.map((msg) =>
            ids.includes(msg.id) ? { ...msg, deliveredAt: date } : msg
          )
        }

        return updated
      })
    }

    socket.on('message:delivered:bulk', handleBulkDelivered)

    return () => {
      socket.off('message:delivered:bulk', handleBulkDelivered)
    }
  }, [])
  useEffect(() => {
    socket.on('users:online:list', ({ users }: { users: number[] }) => {
      setOnlineUsers(new Set(users))
    })

    socket.on('user:online', ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId))
    })

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    })

    return () => {
      socket.off('users:online:list')
      socket.off('user:online')
      socket.off('user:offline')
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        resetChatState,
        messagesByChat,
        setMessagesByChat,
        contatos,
        setContatos,
        selectedChat,
        setSelectedChat,
        onlineUsers,
        isChatOpen,
        setIsChatOpen,
        lastCreatedChatId,
        setCursorByChat,
        cursorByChat,
        loadingHistoryByChat,
        loadingHistoryInitial,
        setLastCreatedChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be inside ChatProvider')
  return ctx
}
