'use client'

import { UserX } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ou 'next/navigation'
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { useAuth } from '../../../context/getMe'; // ajuste o caminho conforme seu projeto
import { blockUser } from '../../../services/authService';
import { MessagePerson } from '../../../utils/components/MessagePerson';

const BlockedConfirmDialog = ({
  idUser,
  username,
}: {
  idUser: number
  username: string
}) => {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const [openDialogBlock, setOpenDialogBlock] = useState(false)

  // Intercepta a abertura do modal
  const handleOpenAttempt = (e: React.MouseEvent) => {
    if (!authUser?.id) {
      e.preventDefault()

      navigate('/auth')
      return
    }
    setOpenDialogBlock(true)
  }

  const handleBlockUser = async () => {
    try {
       await blockUser(idUser)

      // Assumindo que seu service retorna algo para validar o sucesso
      MessagePerson('Sucesso', `Usuário ${username} bloqueado com sucesso!`, 'success')
      setOpenDialogBlock(false)

      // Recarregar a página para atualizar o estado de amizade/posts
      window.location.reload()
    } catch (error) {
      console.log(error)
      MessagePerson('Erro ao bloquear usuário', null, 'error')
    }
  }

  return (
    <Dialog open={openDialogBlock} onOpenChange={setOpenDialogBlock}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenAttempt}
          className="mt-2 flex items-center gap-1.5 rounded-md border border-red-500 bg-transparent px-2.5 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600"
        >
          <UserX className="h-3.5 w-3.5" />
          Bloquear
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-xl bg-white dark:bg-zinc-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-500">
            Bloquear usuário?
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Tem certeza que deseja bloquear este usuário? Ambos deixarão de
            poder trocar mensagens e não verão mais os posts um do outro.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpenDialogBlock(false)}
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleBlockUser}
            className="flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
          >
            <UserX className="h-4 w-4" />
            Bloquear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BlockedConfirmDialog
