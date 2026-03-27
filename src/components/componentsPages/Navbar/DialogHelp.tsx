import { BookOpenText, MessageCircle, Phone, Wind } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useBreathing } from '../../../context/BreathingContext'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

const DialogHelp = () => {
  const [open, setOpen] = useState(false)
  const [showNumber, setShowNumber] = useState(false)
  const { setOpen: setOpenBreathing, setTypeBreathing } = useBreathing()

  const handleCallCVV = () => {
    if (isMobile) {
      window.location.href = 'tel:188'
    } else {
      setShowNumber(true)
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpenBreathing(false)
          setShowNumber(false)
        }
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button className="mx-auto w-full max-w-xs rounded-2xl bg-gradient-to-r from-emerald-200 via-teal-200 to-purple-200 p-5 font-bold text-black/80 shadow-xl transition-all hover:shadow-2xl active:scale-95 dark:from-emerald-800 dark:via-teal-800 dark:to-purple-800 dark:text-white">
          <Phone className="mr-2 h-5 w-5" />
          Preciso de Ajuda
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Como podemos ajudar?
          </DialogTitle>
          <DialogDescription className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Você não está sozinho. Estamos aqui para você.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-4">
          <div
            onClick={handleCallCVV}
            className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <Phone className="h-7 w-7 text-white" />
            <div>
              <p className="text-lg font-bold text-white">
                Ligar para CVV –{' '}
                <span className="inline-block rounded-lg bg-white/20 px-2 py-1 text-base font-extrabold">
                  188
                </span>
              </p>
              <p className="text-sm text-white/90">
                Centro de Valorização da Vida
              </p>

              {showNumber && (
                <p className="mt-2 text-sm font-semibold text-white">
                  📞 Ligue agora pelo seu celular:{' '}
                  <span className="text-lg font-extrabold">188</span>
                </p>
              )}
            </div>
          </div>

          <a
            href="https://cvv.org.br/chat/"
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <div className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95 dark:from-blue-700 dark:to-cyan-700">
              <MessageCircle className="h-7 w-7 text-white" />
              <div>
                <p className="text-lg font-bold text-white">Chat com CVV</p>
                <p className="text-sm text-white/90">
                  Converse agora com alguém que te ajude imediatamente
                </p>
              </div>
            </div>
          </a>

          <div
            onClick={() => {
              setOpen(false)
              setOpenBreathing(true)
              setTypeBreathing('Respiração Profunda')
            }}
            className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl dark:from-emerald-700 dark:to-teal-800"
          >
            <Wind className="h-7 w-7 text-white" />
            <div>
              <p className="text-lg font-bold text-white">
                Exercício de Respiração
              </p>
              <p className="text-sm text-white/90">Acalme sua mente agora</p>
            </div>
          </div>

          {/* Recursos de Apoio */}
          <NavLink onClick={() => setOpen(false)} to="/autocuidado">
            <div className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl dark:from-purple-700 dark:to-pink-700">
              <BookOpenText className="h-7 w-7 text-white" />
              <div>
                <p className="text-lg font-bold text-white">
                  Recursos de Apoio
                </p>
                <p className="text-sm text-white/90">Artigos e exercícios</p>
              </div>
            </div>
          </NavLink>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogHelp
