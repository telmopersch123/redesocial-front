import { forwardRef, useRef } from 'react'
import { formatMentions } from '../../../../utils/formatMentions'

interface MentionInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onEnter?: () => void
  error?: string | undefined
  usuariosSelecionados: { id: number; name_at: string }[]
  disabled?: boolean
}

export const MentionInput = forwardRef<HTMLInputElement, MentionInputProps>(
  (
    { value, onChange, disabled, onFocus, error, usuariosSelecionados },
    ref
  ) => {
    const maskRef = useRef<HTMLDivElement>(null)
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (maskRef.current) {
        maskRef.current.scrollLeft = e.currentTarget.scrollLeft
      }
    }
    return (
      <div className="relative w-full">
        <div
          ref={maskRef}
          className="pointer-events-none absolute inset-0 overflow-hidden whitespace-nowrap rounded-full bg-transparent p-2 text-sm"
          dangerouslySetInnerHTML={{
            __html: formatMentions(value, usuariosSelecionados),
          }}
        />

        <input
          ref={ref}
          value={value}
          onScroll={handleScroll}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
          style={{
            WebkitTextFillColor: value === '' ? 'initial' : 'transparent',
            color: 'transparent',
            background: 'transparent',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
          placeholder="Escreva um comentário..."
          className={`w-full rounded-full border bg-transparent p-2 text-sm caret-purple-600 focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 focus:ring-rose-500'
              : 'border-gray-300 focus:ring-purple-600'
          }`}
        />
      </div>
    )
  }
)
