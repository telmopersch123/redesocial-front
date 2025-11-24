import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'

interface ConfirmationRemoveUserDialogProps {
  userName: string
  trigger: React.ReactNode
  onConfirm: () => void
}

export function ConfirmationRemoveUserDialog({
  userName,
  trigger,
  onConfirm,
}: ConfirmationRemoveUserDialogProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {open && <div className="fixed inset-0 z-50 bg-black/50"></div>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Remover usuário?
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            Tem certeza que deseja remover{' '}
            <span className="font-medium text-red-600">{userName}</span> da
            comunidade? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button variant="destructive" className="gap-2" onClick={onConfirm}>
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
