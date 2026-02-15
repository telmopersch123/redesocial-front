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
import { useInfiniteScrollDialog } from '../../../../hooks/effectsSkeletons'
import {
  DesblockedUser,
  getUsersBlocked,
} from '../../../../services/authService'
import type { TypeFriend } from '../../../../types'
import { Label } from '../../../ui/label'
import { FollowerSkeleton } from '../Skeleton'
import { openOnly } from './ConfigDialog'

interface ListUsersBlockProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
}

const ListUsersBlock = ({ open, setOpen }: ListUsersBlockProps) => {
  const [usersBlock, setUsersBlock] = useState<TypeFriend[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [hasMoreFriend, setHasMoreFriend] = useState(true)
  const [loadedCount, setLoadedCount] = useState(8)
  const { scrollContainerRef, loadMoreRef } = useInfiniteScrollDialog({
    enabled: hasMoreFriend && open && !isLoading,
    hasMore: hasMoreFriend,
    openDelayMs: 0,
    rootMargin: '50px',
    onLoadMore: () => {
      if (isLoading) return
      const next = page + 1
      setPage(next)
      getListUsersBlocked(next)
    },
  })

  const getListUsersBlocked = async (pageNumber = 1) => {
    setIsLoading(true)
    try {
      const resUsersBlock = await getUsersBlocked(pageNumber)
      console.log(resUsersBlock)
      if (resUsersBlock.length < 8) {
        setHasMoreFriend(false)
      }
      setUsersBlock((prev) => {
        const updated =
          pageNumber === 1 ? resUsersBlock : [...prev, ...resUsersBlock]
        setLoadedCount(updated.length)
        return updated
      })
    } catch (error) {
      console.error(error)
      setHasMoreFriend(false)
      toast.error('Erro ao carregar lista de bloqueados.')
    } finally {
      setIsLoading(false)
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
      setPage(1)
      setHasMoreFriend(true)
      getListUsersBlocked(1)
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

        <div
          ref={scrollContainerRef}
          className="custom-scrollbar max-h-[400px] min-h-[200px] overflow-y-auto px-6 py-4"
        >
          {usersBlock.map((user: TypeFriend, index: number) => {
            // A trava baseada no contador de itens carregados
            const isLoaded = index < loadedCount

            return (
              <div className="mb-4" key={`${user.id}-${index}`}>
                {isLoaded ? (
                  <div className="flex items-center justify-between rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name_at}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-purple-100 text-xs font-bold text-purple-700">
                          {user.name_at?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-foreground">
                        @{user.name_at}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnblock(user.id, user.name_at)}
                      className="text-[11px] font-bold text-destructive hover:bg-destructive/10"
                    >
                      Desbloquear
                    </Button>
                  </div>
                ) : (
                  <FollowerSkeleton />
                )}
              </div>
            )
          })}

          {usersBlock.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-3">
                <UserX className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Sua lista está limpa.
              </p>
            </div>
          )}

          {hasMoreFriend && !isLoading && (
            <div
              ref={loadMoreRef}
              className="flex h-10 w-full justify-center py-2"
            >
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ListUsersBlock
