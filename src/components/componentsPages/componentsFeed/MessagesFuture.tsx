import { useAuth } from '@/context/getMe'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Quote, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const MessagesFuture = () => {
  const hasFetched = useRef(false)
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [ignore, setIgnore] = useState(false)
  const [data, setData] = useState<{ message: string } | null>(null)
  const handleClose = () => {
    setIsOpen(false)
    setIgnore(true)
  }

  // Definição das animações para o Modal (Conteúdo)
  const modalVariants: Variants = {
    hidden: {
      y: '-100vh', // Começa completamente fora da tela (em cima)
      opacity: 0,
    },
    visible: {
      y: '15vh', // Posição final onde ele para (coincide com seu mt-[15%])
      opacity: 1,
      transition: {
        type: 'spring', // Dá um efeito de mola suave na descida
        stiffness: 100,
        damping: 15,
        delay: 0.2, // Pequeno delay para o fundo aparecer primeiro
      },
    },
    exit: {
      y: '100vh', // Sai para baixo da tela
      opacity: 0,
      transition: {
        duration: 0.5, // Duração da saída progressiva
        ease: 'easeInOut',
      },
    },
  }

  // Definição das animações para o Overlay (Fundo)
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }, // Coincide com o tempo de saída do modal
    },
  }

  useEffect(() => {
    if (!user) return
    if (hasFetched.current) return
    hasFetched.current = true

    async function getRandomFutureMessage() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/getMessage`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (res.ok) {
          const data = await res.json()

          setData(data)
          setIsOpen(true)
        } else {
          setIgnore(true)
        }
      } catch (error) {
        setIgnore(true)
        console.error('Erro ao buscar mensagem do futuro:', error)
        return null
      }
    }
    getRandomFutureMessage()
  }, [])

  return (
    <>
      <AnimatePresence>
        {isOpen && data ? (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            <button
              onClick={handleClose}
              className="absolute right-10 top-10 z-[101] rounded-full p-1 text-red-400 transition-colors hover:bg-purple-500/10 hover:text-red-600 dark:hover:bg-purple-500/20"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              className="fixed left-0 right-0 z-[101] m-auto flex w-[90%] max-w-lg flex-col gap-3 rounded-2xl border border-purple-500/20 bg-purple-50 p-6 shadow-2xl dark:bg-zinc-900/95"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-purple-500/10" />

              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
                  Nota para o futuro
                </span>
              </div>

              <div className="relative">
                <p className="text-sm italic leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {data.message}
                </p>
              </div>

              <div className="mt-1 flex justify-end">
                <span className="text-[10px] text-zinc-400">
                  Feito por você ❤️
                </span>
              </div>
            </motion.div>
          </>
        ) : ignore === undefined || ignore === false ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center"></div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
