import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'

interface EmojiInputProps {
  onSelect: (emoji: string) => void
}

export function EmojiInput({ onSelect }: EmojiInputProps) {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative flex items-center gap-2">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        😊
      </button>

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-2 z-[9999] mb-2 origin-bottom-right"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis={true} />
        </div>
      )}
    </div>
  )
}
