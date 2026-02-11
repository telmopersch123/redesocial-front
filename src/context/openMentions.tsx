import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { searchUsersMentions } from '../services/authService'

interface MentionLogicContextType {
  getMatches: (
    text: string,
    inputId: string,
    setClickedMention: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  sugestoes: { id: number; name_at: string; avatar: string }[]
  activeInputId: string | null
  setActiveInputId: (id: string | null) => void
  loading: boolean
}

const MentionLogicContext = createContext<MentionLogicContextType | undefined>(
  undefined
)

export function OpenMentionsProvider({ children }: { children: ReactNode }) {
  const [sugestoes, setSugestoes] = useState<
    { id: number; name_at: string; avatar: string }[]
  >([])
  const [activeInputId, setActiveInputId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const debounceTimer = useRef<number | null>(null)
  const getMatches = (
    text: string,
    inputId: string,
    setClickedMention: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    // 1. Pegamos o valor do elemento ativo para saber onde o cursor está
    const selectionStart =
      (document.activeElement as HTMLInputElement | HTMLTextAreaElement)
        ?.selectionStart || 0

    // 2. Pegamos o texto até a posição do cursor
    const textBeforeCursor = text.substring(0, selectionStart)

    // 3. Procuramos o último '@' antes do cursor que não tenha espaço logo após ele
    const match = textBeforeCursor.match(/@([\w._-]+)$/)

    if (!match) {
      setSugestoes([])
      setClickedMention(false)
      return
    }

    const termo = match[1].toLowerCase()
    // Limpa o timer anterior para recomeçar a contagem (Debounce)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (termo.length > 0) {
      setLoading(true)

      debounceTimer.current = setTimeout(async () => {
        try {
          const usersFounds = await searchUsersMentions(termo)

          if (usersFounds && usersFounds.length > 0) {
            setSugestoes(usersFounds)
            setActiveInputId(inputId)
            setClickedMention(true)
          } else {
            setSugestoes([])
            setClickedMention(false)
          }
        } catch (error) {
          console.error('Erro ao buscar menções:', error)
          setSugestoes([])
        } finally {
          setLoading(false)
        }
      }, 300)
    }
  }

  return (
    <MentionLogicContext.Provider
      value={{
        getMatches,
        sugestoes,
        activeInputId,
        setActiveInputId,
        loading,
      }}
    >
      {children}
    </MentionLogicContext.Provider>
  )
}

export function useMentionLogic() {
  const ctx = useContext(MentionLogicContext)
  if (!ctx)
    throw new Error('useMentionLogic deve estar dentro de MentionLogicProvider')
  return ctx
}
