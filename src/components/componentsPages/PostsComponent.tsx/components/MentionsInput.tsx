import { forwardRef } from 'react'
import { formatMentions } from '../../../../utils/formatMentions'

interface MentionInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onEnter?: () => void
  error?: string | undefined
  usuariosSelecionados: { id: number; name_at: string }[]
}

export const MentionInput = forwardRef<HTMLInputElement, MentionInputProps>(
  ({ value, onChange, onFocus, onEnter, error, usuariosSelecionados }, ref) => {
    return (
      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words p-2 text-sm"
          dangerouslySetInnerHTML={{
            __html: formatMentions(value, usuariosSelecionados),
          }}
        />

        <input
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
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
              : 'focus:!ring-purple-600'
          }`}
        />
      </div>
    )
  }
)
