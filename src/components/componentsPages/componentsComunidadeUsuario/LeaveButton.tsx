import { Loader2, LogOut } from 'lucide-react'
import { useState } from 'react'

import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
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
} from '../../ui/alert-dialog'
import { Button } from '../../ui/button'

interface LeaveButtonProps {
  communityId: number
  communityName: string | undefined
}

export const LeaveButton = ({
  communityId,
  communityName,
}: LeaveButtonProps) => {
  const [isLeaving, setIsLeaving] = useState(false)

  const navigate = useNavigate()

  const handleLeave = async () => {
    setIsLeaving(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/leave`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error()

      toast.success(`Você saiu de ${communityName}`)
      navigate('/comunidades', { replace: true })
    } catch (error) {
      toast.error('Erro ao sair da comunidade')
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="group transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          {isLeaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          )}
          Sair da Comunidade
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Você deixará de ser um membro da <strong>{communityName}</strong>.
            Se a comunidade for privada, você poderá não conseguir entrar
            novamente sem um convite.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          >
            Confirmar Saída
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
