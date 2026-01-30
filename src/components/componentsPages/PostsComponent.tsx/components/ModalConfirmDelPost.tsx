import { Trash2 } from 'lucide-react'
import { TooltipComponent } from '../../../globalcomponents/tooltipComponent'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../ui/alert-dialog'
import { Button } from '../../../ui/button'

interface ModalConfirmDelPostProps {
  nameUser: string
}

export const ModalConfirmDelPost = ({ nameUser }: ModalConfirmDelPostProps) => {
  return (
    <AlertDialog>
      <TooltipComponent description="Excluir Postagem">
        <AlertDialogTrigger asChild>
          <div className="flex justify-end">
            <Button
              type="button"
              className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600 hover:shadow-md dark:border-gray-700 dark:bg-[#1b1b1b] dark:text-gray-300 dark:hover:border-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">Excluir</span>
            </Button>
          </div>
        </AlertDialogTrigger>
      </TooltipComponent>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            Admin, você deseja excluir essa postagem?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir a postagem de{' '}
            <span className="font-medium text-foreground">@{nameUser}</span>
            ? <br />
            Essa ação é{' '}
            <span className="font-medium text-red-500">irreversível</span> e a
            postagem será removida permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>

          <AlertDialogAction
            className="rounded-xl bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            onClick={() => {
              alert('Postagem excluída!')
            }}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
