import { Loader2, UserX } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog'
import {
  DesblockedUser,
  getUsersBlocked,
} from '../../../../services/authService'
import type { TypeFriend } from '../../../../types'
import { Label } from '../../../ui/label'
import { openOnly } from './ConfigDialog'

interface ListUsersBlockProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
}

const ListUsersBlock = ({ open, setOpen }: ListUsersBlockProps) => {
  const [usersBlock, setUsersBlock] = useState<TypeFriend[]>([])
  const [loading, setLoading] = useState(false)

  const getListUsersBlocked = async () => {
    try {
      setLoading(true)
      const res = await getUsersBlocked()
      setUsersBlock(res)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar lista de bloqueados.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = async (userId: number, username: string) => {
    try {
      await DesblockedUser(userId)
      setUsersBlock((prev) => prev.filter((u) => u.id !== userId))
      toast.success(`@${username} desbloqueado!`)
    } catch (error) {
      toast.error('Erro ao desbloquear usuário.')
    }
  }

  useEffect(() => {
    if (open) {
      getListUsersBlocked()
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value) {
          openOnly({ index: 0, setOpenDialog: setOpen })
        } else {
          setOpen((prev) => prev.map(() => false))
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-sm">
          <div className="flex flex-col items-start gap-1">
            <Label className="cursor-pointer text-sm font-semibold">
              Usuários Bloqueados
            </Label>
            <p className="text-xs text-muted-foreground">
              Pessoas que você bloqueou não podem te enviar mensagens.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 hover:underline">
            Gerenciar
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="z-[70] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserX className="h-5 w-5 text-destructive" />
            Usuários bloqueados
          </DialogTitle>
          <DialogDescription>
            Abaixo estão os usuários que você bloqueou.
          </DialogDescription>
        </DialogHeader>

        <div className="custom-scrollbar max-h-[400px] min-h-[200px] overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : usersBlock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-3">
                <UserX className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Sua lista está limpa.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {usersBlock.map((userB) => (
                <div
                  key={userB.id}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-3 transition-colors hover:bg-accent/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarImage
                        src={userB.avatar || ''}
                        alt={userB.name_at}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-purple-100 text-xs font-bold text-purple-700">
                        {userB.name_at?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-[11px] text-muted-foreground">
                        @{userB.name_at}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnblock(userB.id, userB.name_at)}
                    className="h-8 border-destructive/20 px-3 text-[11px] font-bold text-destructive hover:bg-destructive hover:text-white"
                  >
                    Desbloquear
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ListUsersBlock
