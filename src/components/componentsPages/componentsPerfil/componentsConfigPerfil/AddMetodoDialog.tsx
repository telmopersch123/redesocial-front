import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog'
import { Input } from '../../../ui/input'

interface DialogAddMetodoProps {
  onAddMetodo: (metodo: string) => void
}

const AddMetodoDialog = ({ onAddMetodo }: DialogAddMetodoProps) => {
  const [novoMetodo, setNovoMetodo] = useState('')

  function handleAddMetodo() {
    if (!novoMetodo.trim()) return
    onAddMetodo?.(novoMetodo.trim())
    setNovoMetodo('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-linear-purple transition-all hover:shadow-lg"
          size="sm"
        >
          <Plus className="mr-1 h-4 w-4" />
          Adicionar método
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] rounded-md sm:w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar método de autocuidado</DialogTitle>
          <DialogDescription>
            Crie um novo método de autocuidado que te ajude a manter o bem-estar
            diário.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Ex: Meditar 10 minutos ao acordar"
            value={novoMetodo}
            onChange={(e) => setNovoMetodo(e.target.value)}
          />
        </div>

        <DialogFooter className="gap-3 sm:justify-start">
          <DialogClose asChild>
            <Button
              className="shadow-md"
              type="button"
              variant="secondary"
              onClick={() => setNovoMetodo('')}
            >
              Cancelar
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={handleAddMetodo}
              className="bg-linear-purple w-full transition-shadow hover:shadow-md"
            >
              Adicionar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddMetodoDialog
