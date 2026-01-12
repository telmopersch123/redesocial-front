import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Contato } from '../pages/MessagePage'
import { socket } from '../services/socket'
import { useAuth } from './getMe'

interface MSG {
  id: string
  tempId?: string
  chatId?: string
  content: string
  senderId: number
  remetente: 'eu' | 'outro'
  createdAt: Date
  readAt?: Date
  status?: 'pending' | 'sent'
  senderName: string
}

interface incomingType {
  id: string
  tempId?: string
  chatId?: string
  content: string
  senderId: number
  remetente: 'eu' | 'outro'
  createdAt: Date
  readAt?: Date
  status?: 'pending' | 'sent'
  senderName: string
  targetUser: {
    id: number
    name_at: string
    avatar: string
  }
}
interface ChatContextType {
  messages: MSG[]
  setMessages: React.Dispatch<React.SetStateAction<MSG[]>>
  contatos: Contato[]
  setContatos: React.Dispatch<React.SetStateAction<Contato[]>>
  selectedChat: string | null
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>
  typingUsers: Record<string, number[]>
  onlineUsers: Set<number>
  isChatOpen: boolean
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<MSG[]>([])
  const [contatos, setContatos] = useState<Contato[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, number[]>>({})
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set())
  const [isChatOpen, setIsChatOpen] = useState(false)

  const selectedChatRef = useRef<string | null>(null)
  useEffect(() => {
    selectedChatRef.current = selectedChat
  }, [selectedChat])
  useEffect(() => {
    socket.on('presence:update', (userIds: number[]) => {
      setOnlineUsers(new Set(userIds))
    })

    return () => {
      socket.off('presence:update')
    }
  }, [])
  useEffect(() => {
    const handleTyping = ({ chatId, userId, isTyping }: any) => {
      setTypingUsers((prev) => {
        const users = prev[chatId] ?? []

        if (isTyping) {
          if (users.includes(userId)) return prev
          return { ...prev, [chatId]: [...users, userId] }
        }

        return {
          ...prev,
          [chatId]: users.filter((id) => id !== userId),
        }
      })
    }

    socket.on('chat:typing', handleTyping)

    return () => {
      socket.off('chat:typing', handleTyping)
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return

    const handleReceiveMessage = (incoming: incomingType) => {
      if (!incoming.chatId) return

      const isMine = incoming.senderId === Number(user.id)

      const normalized: MSG = {
        ...incoming,
        createdAt: new Date(incoming.createdAt),
        remetente: isMine ? 'eu' : 'outro',
        status: isMine ? 'sent' : undefined,
        senderName: incoming.senderName,
      }

      if (!isMine && isChatOpen) {
        normalized.readAt = new Date()

        socket.emit('chat:read', {
          chatId: normalized.chatId,
        })
      }

      setContatos((prev: Contato[]) => {
        const contato = prev.find((c) => c.chatId === normalized.chatId)
        if (contato) {
          const updated = prev.map((c) =>
            c.chatId === normalized.chatId
              ? {
                  ...c,
                  contact: {
                    id: isMine ? incoming.targetUser.id : incoming.senderId,
                    name_at: isMine
                      ? incoming.targetUser.name_at
                      : incoming.senderName,
                    avatar: '',
                  },
                  unreadMessages:
                    !isMine && selectedChatRef.current !== normalized.chatId
                      ? c.unreadMessages + 1
                      : c.unreadMessages,
                  lastMessage: {
                    id: normalized.id,
                    chatId: normalized.chatId!,
                    senderId: normalized.senderId,
                    content: normalized.content,
                    createdAt: normalized.createdAt,
                    readAt: normalized.readAt,
                  },
                  lastMessageReadStatus:
                    isMine || selectedChatRef.current === normalized.chatId,
                }
              : c
          )

          const changed = updated.find((c) => c.chatId === normalized.chatId)!
          const rest = updated.filter((c) => c.chatId !== normalized.chatId)

          return [changed, ...rest]
        }

        // CONTATO NÃO EXISTE (conversa apagada)
        return [
          {
            chatId: normalized.chatId!,
            contact: {
              id: isMine ? incoming.targetUser.id : incoming.senderId,
              name_at: isMine
                ? incoming.targetUser.name_at
                : incoming.senderName,
              avatar: '',
            },
            lastMessage: {
              id: normalized.id,
              chatId: normalized.chatId!,
              senderId: normalized.senderId,
              content: normalized.content,
              createdAt: normalized.createdAt,
              readAt: isMine ? new Date() : undefined,
            },
            unreadMessages: !isMine ? 1 : 0,
            lastMessageReadStatus: isMine,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]
      })

      // Só mexe nas mensagens SE o chat estiver aberto
      if (selectedChatRef.current === normalized.chatId) {
        setMessages((prev) => {
          const map = new Map<string, MSG>()
          prev.forEach((m) => {
            const key = m.tempId ?? m.id
            if (!key) return

            map.set(key, {
              ...m,
              createdAt:
                m.createdAt instanceof Date
                  ? m.createdAt
                  : new Date(m.createdAt),
            })
          })

          const incomingKey = incoming.tempId ?? incoming.id
          map.set(incomingKey, {
            ...incoming,
            remetente: incoming.senderId === Number(user?.id) ? 'eu' : 'outro',
            createdAt: new Date(incoming.createdAt),
            status: incoming.senderId === Number(user?.id) ? 'sent' : undefined,
            senderName: incoming.senderName,
            id: incoming.id, // Garante que o id real do backend substitua o tempId
            tempId: undefined, // Remove o tempId, pois não precisamos mais
          })
          return [...map.values()].sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          )
        })
      }
    }

    socket.on('chat:receive', handleReceiveMessage)
    return () => {
      socket.off('chat:receive', handleReceiveMessage)
    }
  }, [user?.id])

  useEffect(() => {
    if (!selectedChat || !user?.id) return

    setMessages((prev) =>
      prev.map((m) =>
        m.chatId === selectedChat && m.senderId !== Number(user.id) && !m.readAt
          ? { ...m, readAt: new Date() }
          : m
      )
    )

    setContatos((prev) =>
      prev.map((c) =>
        c.chatId === selectedChat &&
        c.lastMessage &&
        c.lastMessage.senderId !== Number(user.id) &&
        !c.lastMessage.readAt
          ? {
              ...c,
              lastMessage: {
                ...c.lastMessage,
                readAt: new Date(),
              },
              unreadMessages: 0,
              lastMessageReadStatus: true,
            }
          : c
      )
    )
  }, [selectedChat, user?.id])

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        contatos,
        setContatos,
        selectedChat,
        setSelectedChat,
        typingUsers,
        onlineUsers,
        isChatOpen,
        setIsChatOpen,
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
