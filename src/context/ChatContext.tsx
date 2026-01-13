import { createContext, useContext, useEffect, useState } from 'react'
import type { Contato } from '../pages/MessagePage'
import { getContatos } from '../services/authService'
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

interface IncomingMessage {
  id: string
  chatId: string
  content: string
  senderId: number
  createdAt: Date
  readAt?: Date
  senderName: string
}

interface incomingType {
  id: string
  tempId?: string
  chatId: string
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
  messagesByChat: Record<string, MSG[]>
  setMessagesByChat: React.Dispatch<React.SetStateAction<Record<string, MSG[]>>>
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
  const [messagesByChat, setMessagesByChat] = useState<Record<string, MSG[]>>(
    {}
  )
  const [contatos, setContatos] = useState<Contato[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, number[]>>({})
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set())
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const handleChatUpdated = async () => {
      const response = await getContatos()
      setContatos(response)
    }

    socket.on('chat:updated', handleChatUpdated)

    return () => {
      socket.off('chat:updated', handleChatUpdated)
    }
  }, [])

  useEffect(() => {
    const handleReceive = (msg: IncomingMessage) => {
      setMessagesByChat((prev) => {
        const list = prev[msg.chatId] ?? []

        return {
          ...prev,
          [msg.chatId]: [
            ...list,
            {
              ...msg,
              remetente: msg.senderId === Number(user?.id) ? 'eu' : 'outro',
            },
          ],
        }
      })
    }

    socket.on('message:receive', handleReceive)

    return () => {
      socket.off('message:receive', handleReceive)
    }
  }, [user?.id])

  return (
    <ChatContext.Provider
      value={{
        messagesByChat,
        setMessagesByChat,
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
