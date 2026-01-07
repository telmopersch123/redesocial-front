import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Contato, MSG } from '../pages/MessagePage'
import { socket } from '../services/socket'

type ChatContextType = {
  contatos: Contato[]
  setContatos: React.Dispatch<React.SetStateAction<Contato[]>>
  messagesByChat: Record<string, MSG[]>
  setMessagesByChat: React.Dispatch<React.SetStateAction<Record<string, MSG[]>>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [messagesByChat, setMessagesByChat] = useState<Record<string, MSG[]>>(
    {}
  )

  /* 
     CHAT: RECEIVE (MENSAGEM)
     */
  useEffect(() => {
    const handleReceive = (incoming: MSG) => {
      const chatId = incoming.chatId
      if (!chatId) return

      /*  NORMALIZA A MENSAGEM */
      const normalized: MSG = {
        ...incoming,
        createdAt:
          incoming.createdAt instanceof Date
            ? incoming.createdAt
            : new Date(incoming.createdAt),
        remetente: undefined,
        status: undefined,
      }

      /*  ATUALIZA MENSAGENS  */
      setMessagesByChat((prev) => {
        const current = prev[chatId] ?? []

        const map = new Map<string, MSG>()

        current.forEach((m) => {
          const key = m.tempId ?? m.id
          if (!key) return
          map.set(key, m)
        })

        const newKey = normalized.tempId ?? normalized.id
        map.set(newKey, normalized)

        return {
          ...prev,
          [chatId]: [...map.values()].sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          ),
        }
      })

      /*  (SOBE PRO TOPO)  */
      setContatos((prev) => {
        const updated = prev.map((c) =>
          c.chatId === chatId
            ? {
                ...c,
                lastMessage: {
                  id: incoming.id,
                  chatId,
                  senderId: incoming.senderId,
                  content: incoming.content,
                  createdAt: incoming.createdAt,
                },
              }
            : c
        )

        const changed = updated.find((c) => c.chatId === chatId)
        const rest = updated.filter((c) => c.chatId !== chatId)

        return changed ? [changed, ...rest] : prev
      })
    }

    socket.on('chat:receive', handleReceive)
    return () => {
      socket.off('chat:receive', handleReceive)
    }
  }, [])

  /* 
     CHAT: READ (VISUALIZADO)
      */
  useEffect(() => {
    const handleRead = ({ chatId }: { chatId: string }) => {
      setMessagesByChat((prev) => {
        const messages = prev[chatId]
        if (!messages) return prev

        return {
          ...prev,
          [chatId]: messages.map((m) =>
            m.senderId !== undefined && !m.readAt
              ? { ...m, readAt: new Date() }
              : m
          ),
        }
      })
    }

    socket.on('chat:read', handleRead)
    return () => {
      socket.off('chat:read', handleRead)
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        contatos,
        setContatos,
        messagesByChat,
        setMessagesByChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

/* =========================
   HOOK
   ========================= */
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
