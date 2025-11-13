interface CharacterCounterProps {
  error: string
  valueLength: number
  maxLength: number
}

export function MessageForms({
  error,
  valueLength,
  maxLength,
}: CharacterCounterProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span
        className={`transition-all ${error ? 'text-red-500' : 'text-gray-400'}`}
      >
        {error || `${valueLength}/${maxLength} caracteres`}
      </span>
    </div>
  )
}
