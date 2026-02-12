import { useState } from 'react'
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
type PropsPerfilPageUnFriend = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  username: string
  idUser: number
  refreshProfile: (idUser?: number) => Promise<void>
}

import { HeartHandshake, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { unFriendShip } from '../../../services/authService'

export const UnFriendShipDialog = ({
  open,
  setOpen,
  username,
  idUser,
  refreshProfile,
}: PropsPerfilPageUnFriend) => {
  const [loading, setLoading] = useState(false)

  async function UnFriendShip() {
    setLoading(true)
    try {
      await unFriendShip(idUser)
      toast.success(
        'Amizade desfeita com sucesso! Você não é mais amigo de ' + username
      )
      refreshProfile(Number(idUser) || undefined)
      setOpen(false)
    } catch {
    } finally {
      setLoading(false)
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-linear-purple group relative overflow-hidden rounded-full px-6 py-2 font-bold text-white transition-all duration-300 active:scale-95">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 transition-transform group-hover:scale-125 group-hover:text-red-700" />
            <span>Amigos</span>
          </div>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desfazer amizade?</AlertDialogTitle>

          <AlertDialogDescription>
            Você realmente deseja desfazer amizade com{' '}
            <span className="font-semibold underline">{username}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            onClick={UnFriendShip}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? (
              <>
                Desfazendo amizade
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Desfazer amizade'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
