import { AlertCircle, Edit2 } from 'lucide-react'
import { useLimitForms } from '../../../../hooks/useLimitForms'
import { MessageForms } from '../../../formCustomer/MessageForms'
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

interface DialogEditNomeProps {
  nomeUser: string | null
  setNomeUser: (nomeUser: string) => void
}

const EditNomeDialog = ({ nomeUser, setNomeUser }: DialogEditNomeProps) => {
  const nameUserControl = useLimitForms(50)
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="mr-1 h-3 w-3" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] rounded-md sm:w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar nome</DialogTitle>
          <DialogDescription>
            Lembre-se de escolher um nome que reflita sua identidade e
            personalidade.
          </DialogDescription>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="font-medium">
              Importante: após a alteração, você só poderá alterar novamente em
              7 dias.
            </p>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <Input
            placeholder="Nome de exibição"
            value={nomeUser || ''}
            onChange={(e) => {
              nameUserControl.handleChange(e)
              setNomeUser(e.target.value)
            }}
          />
          <MessageForms
            error={nameUserControl.error}
            valueLength={nameUserControl.value.length}
            maxLength={nameUserControl.maxLength}
          />
        </div>
        <DialogFooter className="gap-3 sm:justify-start">
          <DialogClose asChild>
            <Button className="shadow-md" type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <Button className="bg-linear-purple w-full transition-shadow hover:shadow-md">
            Alterar Nome
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditNomeDialog
