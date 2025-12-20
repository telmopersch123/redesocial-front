import { Loader2, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../../ui/button'

const MessageDayComponent = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const translate = async (message: string) => {
    const res = await fetch('/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const data = await res.json()
    setLoading(false)
    return data.translated
  }

  const fetchMessage = async () => {
    const res = await fetch('https://api.adviceslip.com/advice')
    const data = await res.json()
    const translated = await translate(data.slip.advice)

    const now = new Date().getTime()
    localStorage.setItem('messageDay', translated)
    localStorage.setItem('messageDayTime', now.toString())
    setMessage(translated)
  }

  useEffect(() => {
    const savedMessage = localStorage.getItem('messageDay')
    const savedTime = localStorage.getItem('messageDayTime')

    if (savedMessage && savedTime) {
      const elapsed = new Date().getTime() - parseInt(savedTime)
      // valida se ja se passaram as 24 horas
      if (elapsed < 24 * 60 * 60 * 1000) {
        setMessage(savedMessage)
        setLoading(false)
        return
      }
    }

    fetchMessage()
  }, [])

  return (
    <div className="flex h-[180px] flex-col gap-4 rounded-2xl bg-[#F3F7FE] p-5 text-center shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900 dark:shadow-zinc-800">
      <div className="flex flex-col gap-2">
        <p className="truncate text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Afirmação do Dia
        </p>
        <div className="flex h-[50px] items-center justify-center">
          <h2
            className={`flex justify-center text-sm font-bold italic text-zinc-900 dark:text-zinc-100 2xl:text-lg ${loading ? '' : 'duration-500 animate-in slide-in-from-bottom'}`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            ) : (
              message
            )}
          </h2>
        </div>
      </div>
      <Button
        onClick={() => {
          setLoading(true)
          fetchMessage()
        }}
        className="m-auto flex w-fit items-center gap-2 rounded-full bg-white text-[#a5d3ff] shadow-sm hover:bg-zinc-100 dark:bg-zinc-800 dark:text-purple-400 dark:hover:bg-zinc-700"
      >
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="truncate">Nova Afirmação</span>
      </Button>
    </div>
  )
}

export default MessageDayComponent
