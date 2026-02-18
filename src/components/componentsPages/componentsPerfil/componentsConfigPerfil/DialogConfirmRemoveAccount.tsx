import { HeartCrack, Loader2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
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
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me/delete`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (res.ok) {
        toast.success('Conta excluída com sucesso.')

        navigate('/auth', { replace: true })
      } else {
        toast.error(data.error || 'Erro ao excluir conta.')
      }
    } catch (err) {
      toast.error('Erro de conexão com o servidor.')
    } finally {
      setIsDeleting(false)
    }
  }
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

      <DialogContent className="z-[70] w-[90%] rounded-2xl border-none im:max-w-sm">
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

          <Button onClick={handleConfirmDelete} variant="destructive">
            Sim! <HeartCrack />{' '}
          </Button>
        </DialogFooter>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center rounded-md bg-black/60">
            <div className="flex h-16 items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
              <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Excluindo sua conta...
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogConfirmRemoveAccount
