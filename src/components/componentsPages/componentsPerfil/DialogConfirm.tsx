import { Button } from '../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'

interface Dialog2EtapasProps {
  confirmDialogOpen: boolean
  setConfirmDialogOpen: (confirmDialogOpen: boolean) => void
  confirmDisableTwoFactor: () => void
}

const ConfirmDialog2Etapas = ({
  confirmDialogOpen,
  setConfirmDialogOpen,
  confirmDisableTwoFactor,
}: Dialog2EtapasProps) => {
  return (
    <Dialog
      modal={false}
      open={confirmDialogOpen}
      onOpenChange={setConfirmDialogOpen}
    >
      <DialogContent className="rounded-2xl bg-background/95 p-6 shadow-2xl backdrop-blur-sm data-[state=open]:animate-in">
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
              onClick={() => setConfirmDialogOpen(false)}
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

export default ConfirmDialog2Etapas
