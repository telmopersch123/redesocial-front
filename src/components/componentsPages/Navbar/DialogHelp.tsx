import { BookOpenText, Phone, Wind } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useBreathing } from '../../../context/BreathingContext'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'

const DialogHelp = () => {
  const [open, setOpen] = useState(false)
  const { setOpen: setOpenBreathing, setTypeBreathing } = useBreathing()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-auto w-full max-w-xs rounded-2xl bg-[linear-gradient(to_right,#b8e6d6,#b3dedf,#aed6ed,#a9d0f4,#a6caff)] p-4 font-semibold text-black/70 shadow-lg transition-all hover:shadow-xl active:shadow-md">
          <Phone className="mr-2 inline h-5 w-5" />
          Preciso de Ajuda
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-white/40 backdrop-blur-sm" />
      <DialogContent className="w-[90%] rounded-2xl shadow-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            Como podemos ajudar?
          </DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            Você não está sozinho. Estamos aqui para você.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3">
          {/* Ligar para CVV */}
          <div className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[linear-gradient(to_right,#a6c9ff,#b8c0ff,#c7b9ff)] p-4 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl">
            <Phone className="h-6 w-6 !text-white" />
            <div>
              <p className="text-base font-semibold !text-white">
                Ligar para CVV -{' '}
                <span className="rounded-md bg-card-foreground/10 p-0.5 text-sm font-semibold">
                  188
                </span>
              </p>
              <p className="text-sm !text-white">
                Centro de Valorização da Vida
              </p>
            </div>
          </div>

          {/* Exercício de Respiração */}
          <div
            onClick={() => {
              setOpen(false)
              setOpenBreathing(true)
              setTypeBreathing('Respiração Profunda')
            }}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[linear-gradient(to_right,#b7e5d5,#b0dae8,#a5cafe)] p-4 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
          >
            <Wind className="h-6 w-6 text-foreground/80" />
            <div>
              <p className="text-base font-semibold text-foreground">
                Exercício de Respiração
              </p>
              <p className="text-sm text-muted-foreground">
                Acalme sua mente agora
              </p>
            </div>
          </div>

          {/* Recursos de Apoio */}
          <NavLink onClick={() => setOpen(false)} to="/autocuidado">
            <div className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[linear-gradient(to_right,#e7ddff,#d4c7ff,#c7baff)] p-4 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl">
              <BookOpenText className="h-6 w-6 text-foreground/80" />
              <div>
                <p className="text-base font-semibold text-foreground">
                  Recursos de Apoio
                </p>
                <p className="text-sm text-muted-foreground">
                  Artigos e exercícios
                </p>
              </div>
            </div>
          </NavLink>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogHelp
