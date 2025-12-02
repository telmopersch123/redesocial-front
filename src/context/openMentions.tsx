import { createContext, useContext, useState, type ReactNode } from 'react'

interface MentionLogicContextType {
  getMatches: (
    text: string,
    inputId: string,
    setClickedMention: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  sugestoes: string[]

  activeInputId: string | null
  setActiveInputId: (id: string | null) => void
}
export const usuariosMentions = [
  'ana',
  'anderson',
  'andre',
  'telmo',
  'maria',
  'joao',
  'jose',
  'mariana',
  'carlos',
  'paula',
]
const MentionLogicContext = createContext<MentionLogicContextType | undefined>(
  undefined
)

export function OpenMentionsProvider({ children }: { children: ReactNode }) {
  const [sugestoes, setSugestoes] = useState<string[]>([])
  const [activeInputId, setActiveInputId] = useState<string | null>(null)
  const getMatches = (
    text: string,
    inputId: string,
    setClickedMention: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (activeInputId !== inputId) return
    const lastWord = text.split(/\s+/).pop() || ''

    if (!lastWord.startsWith('@')) {
      setSugestoes([])
      setClickedMention(false)
      return
    }
    const termo = lastWord.slice(1).toLowerCase()

    const encontrados = usuariosMentions.filter((nome) =>
      nome.toLowerCase().startsWith(termo)
    )

    setSugestoes(encontrados)
    setClickedMention(encontrados.length > 0)
  }

  return (
    <MentionLogicContext.Provider
      value={{
        getMatches,
        sugestoes,
        activeInputId,
        setActiveInputId,
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
