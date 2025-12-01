import { usuariosMentions } from '../PostComponentDialog'

interface MentionInputProps {
  clickedMention: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEnter?: () => void
  error?: string | undefined
}

const MentionInput = ({
  clickedMention,
  value,
  onChange,
  onEnter,
  error,
}: MentionInputProps) => {
  const formatMentions = (text: string) => {
    return text.replace(/@[\w._-]+/g, (match) => {
      const username = match.slice(1) // remove "@"

      // SOMENTE menções COMPLETAS entram no roxo
      if (usuariosMentions.includes(username)) {
        return `<span class="text-purple-500  underline">${match}</span>`
      }

      // menção incompleta → retorna normal!
      return match
    })
  }

  return (
    <div className="relative w-full">
      {/* camada estilizada */}
      <div
        className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words p-2 text-sm"
        dangerouslySetInnerHTML={{ __html: formatMentions(value) }}
      />

      {/* input real */}
      <input
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onEnter?.()
          }
        }}
        style={{
          WebkitTextFillColor: value === '' ? 'initial' : 'transparent',
          caretColor: '#6b21a8',
        }}
        placeholder="Escreva um comentário..."
        className={`relative w-full rounded-full border bg-transparent p-2 text-sm ${
          error
            ? '!border-rose-300 focus:!ring-rose-500'
            : 'focus:border-transparent focus:!ring-purple-600'
        }`}
      />
    </div>
  )
}
export default MentionInput
