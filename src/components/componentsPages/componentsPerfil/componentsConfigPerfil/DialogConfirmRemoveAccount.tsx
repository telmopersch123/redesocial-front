import { HeartCrack } from 'lucide-react'
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
import { openOnly } from './ConfigDialog'

interface DialogConfirmRemoveAccountProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
}

const DialogConfirmRemoveAccount = ({
  open,
  setOpen,
}: DialogConfirmRemoveAccountProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value) {
          openOnly({ index: 1, setOpenDialog: setOpen })
        } else {
          setOpen((prev) => prev.map(() => false))
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Remover
        </Button>
      </DialogTrigger>

      <DialogContent className="z-[70] w-[90%] rounded-2xl im:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Confirmar remoção da conta
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Esta ação é permanente e não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-sm text-foreground">
          Tem certeza absoluta de que deseja remover sua conta?
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">NÃO!!!</Button>
          </DialogClose>

          <Button variant="destructive">
            Sim! <HeartCrack />{' '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogConfirmRemoveAccount
