import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog'
import { openOnly } from './ConfigDialog'

interface Dialog2EtapasProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  confirmDisableTwoFactor: () => void
}

const ConfirmTwoStepsDialog = ({
  open,
  setOpen,
  confirmDisableTwoFactor,
}: Dialog2EtapasProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value) {
          openOnly({ index: 2, setOpenDialog: setOpen })
        } else {
          setOpen((prev) => prev.map(() => false))
        }
      }}
    >
      <DialogContent className="z-[70] w-[90%] rounded-2xl bg-background/95 p-6 shadow-2xl backdrop-blur-sm data-[state=open]:animate-in md:w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Desativar autenticação em duas etapas?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Isso reduzirá a segurança da sua conta. Você deseja realmente
            continuar?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={(value) =>
                setOpen(value ? [false, false, false] : [false, false, false])
              }
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={confirmDisableTwoFactor}
            className="bg-red-600 hover:bg-red-700"
          >
            Desativar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmTwoStepsDialog
