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
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<MSG[]>([])
  const [contatos, setContatos] = useState<Contato[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, number[]>>({})
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set())

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

    const handleReceiveMessage = (incoming: MSG) => {
      if (!incoming.chatId) return

      const isMine = incoming.senderId === Number(user.id)

      const normalized: MSG = {
        ...incoming,
        createdAt: new Date(incoming.createdAt),
        remetente: isMine ? 'eu' : 'outro',
        status: isMine ? 'sent' : undefined,
      }

      setContatos((prev: Contato[]) => {
        const updated = prev.map((c) =>
          c.chatId === normalized.chatId
            ? {
                ...c,
                unreadMessages: c.unreadMessages + 1,
                lastMessage: {
                  id: normalized.id,
                  createdAt: normalized.createdAt,
                  chatId: normalized.chatId!,
                  senderId: normalized.senderId,
                  content: normalized.content,
                  readAt: normalized.readAt,
                },
              }
            : c
        )

        const changed = updated.find((c) => c.chatId === normalized.chatId)
        const rest = updated.filter((c) => c.chatId !== normalized.chatId)

        return changed ? [changed, ...rest] : prev
      })

      // 🔹 Só mexe nas mensagens SE o chat estiver aberto
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
          map.set(normalized.tempId ?? normalized.id, normalized)
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
              },
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
