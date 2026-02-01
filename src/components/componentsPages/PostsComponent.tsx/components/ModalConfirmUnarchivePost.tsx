'use client'

import { ArchiveRestore } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRefreshPermission } from '../../../../context/RefreshPermissionContext'

import { UnarchivePostCommunity } from '../../../../services/authService'
import { TooltipComponent } from '../../../globalcomponents/tooltipComponent'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../ui/alert-dialog'
import { Button } from '../../../ui/button'

interface ModalConfirmUnarchivePostProps {
  nameUser: string
  postId: string | number
  open?: boolean
  setOpen?: (open: boolean) => void
  disabled?: boolean
  communityId: number
}

export const ModalConfirmUnarchivePost = ({
  nameUser,
  postId,
  open,
  setOpen,
  disabled,
  communityId,
}: ModalConfirmUnarchivePostProps) => {
  const [loading, setLoading] = useState(false)
  const { triggerRefresh } = useRefreshPermission()

  const handleUnarchive = async () => {
    setLoading(true)
    try {
      await UnarchivePostCommunity(postId, communityId)
      toast.success('Post desarquivado com sucesso')
      triggerRefresh()
      if (setOpen) setOpen(false)
    } catch {
      toast.error('Erro ao desarquivar post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipComponent description="Desarquivar Postagem">
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            className={`group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm transition-all hover:border-green-400 hover:bg-green-50 hover:text-green-600 dark:border-gray-700 dark:bg-[#1b1b1b] dark:text-gray-300 dark:hover:border-green-500 dark:hover:bg-green-500/10 ${
              disabled && 'hidden'
            }`}
          >
            <ArchiveRestore className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="text-sm font-medium">Desarquivar</span>
          </Button>
        </AlertDialogTrigger>
      </TooltipComponent>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Desarquivar postagem?</AlertDialogTitle>

          <AlertDialogDescription>
            Moderador, você deseja tornar a postagem de{' '}
            <span className="font-medium">@{nameUser}</span> visível novamente
            para a comunidade?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>

          <Button
            onClick={handleUnarchive}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? (
              <>
                Desarquivando
                <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </>
            ) : (
              'Desarquivar'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
