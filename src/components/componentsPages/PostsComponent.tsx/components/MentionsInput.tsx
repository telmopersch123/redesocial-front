import { formatMentions } from '../../../../utils/formatMentions'

interface MentionInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEnter?: () => void
  error?: string | undefined
}

const MentionInput = ({
  value,
  onChange,
  onEnter,
  error,
}: MentionInputProps) => {
  const userId = 12
  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words p-2 text-sm"
        dangerouslySetInnerHTML={{
          __html: formatMentions(value, userId),
        }}
      />

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
