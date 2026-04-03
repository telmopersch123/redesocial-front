import { Loader2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { useInfiniteScrollDialog } from '../../../hooks/effectsSkeletons'

import { UserAvatar } from '@/utils/components/UserAvatar'
import { NavLink } from 'react-router-dom'
import { getFriends } from '../../../services/authService'
import type { TypeFriend } from '../../../types'
import { filter } from '../../../utils/functions'
import { Input } from '../../ui/input'
import { FollowerSkeleton } from './Skeleton'

interface PropsFriends {
  username: string
  profileId: number
}
export function FriendsDialog({ username, profileId }: PropsFriends) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<string>('')
  const [amigosFiltrados, setAmigosFiltrados] = useState<TypeFriend[]>([])
  const [empty, setEmpty] = useState(false)
  const [page, setPage] = useState(1)
  const [myFriends, setMyFriends] = useState<TypeFriend[]>([])
  const [hasMoreFriend, setHasMoreFriend] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loadedCount, setLoadedCount] = useState(8)
  const [totalFriends, setTotalFriends] = useState(0)
  const [initialLoading, setInitialLoading] = useState(true)

  const { scrollContainerRef, loadMoreRef } = useInfiniteScrollDialog({
    enabled: hasMoreFriend && open && !isLoading,
    hasMore: hasMoreFriend,
    openDelayMs: 0,
    rootMargin: '50px',
    onLoadMore: () => {
      if (isLoading) return
      const next = page + 1
      setPage(next)
      getMyFriends(next)
    },
  })

  async function getMyFriends(pageNumber = 1) {
    if (!profileId) return
    setIsLoading(true)
    try {
      const friends = await getFriends(profileId, pageNumber)

      if (friends.formattedFriends.length < 8) setHasMoreFriend(false)
      setTotalFriends(friends.totalFriends)
      setMyFriends((prev) => {
        const updated =
          pageNumber === 1
            ? friends.formattedFriends
            : [...prev, ...friends.formattedFriends]

        setLoadedCount(updated.length)

        return updated
      })
    } catch (error) {
      setHasMoreFriend(false)
      console.log(error)
    } finally {
      setInitialLoading(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMyFriends(1)
  }, [profileId])

  useEffect(() => {
    if (open) {
      setSearch('')
      setSearch('')
      setPage(1)
      setHasMoreFriend(true)
      getMyFriends(1)
      filter(search, myFriends, setAmigosFiltrados, setEmpty)
    }
  }, [open])
  useEffect(() => {
    if (open) {
      filter(search, myFriends, setAmigosFiltrados, setEmpty)
    }
  }, [search, myFriends])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Use onde quiser (ex: no lugar do "150 amigos") */}
        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-muted">
          <span className="text-xl font-bold text-foreground">
            {totalFriends && !initialLoading
              ? totalFriends
              : !initialLoading && 0}
            {initialLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-blue-500" />
            {totalFriends === 1 ? 'amigo' : 'amigos'}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-[98%] max-w-md rounded-2xl border bg-background/95 p-6 shadow-xl backdrop-blur-sm sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-foreground">
            Amigos de {username}
          </DialogTitle>
          <p className="mt-2 text-center text-muted-foreground">
            {myFriends.length} {myFriends.length === 1 ? 'amigo' : 'amigos'}
          </p>
          <div>
            <Input
              type="text"
              placeholder="Buscar seguidores"
              className="mt-4"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DialogHeader>

        {totalFriends ? (
          <div
            ref={scrollContainerRef}
            className="scrollbar mt-6 h-[500px] space-y-3 overflow-y-auto"
          >
            {amigosFiltrados.map((amigo: TypeFriend, index: number) => {
              const isLoaded = index < loadedCount

              if (!amigo) return
              return (
                <div key={amigo.id + '-' + index}>
                  {isLoaded ? (
                    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
                      {amigo.avatar ? (
                        <div className="mt-0.5 shrink-0 rounded-full bg-muted/50 p-2 group-hover:bg-background">
                          <UserAvatar
                            url={amigo.avatar}
                            name={amigo.name_at}
                            className="h-10 w-10 ring-4 ring-white transition-transform duration-300 group-hover:ring-purple-200 dark:ring-zinc-900 dark:group-hover:ring-purple-800"
                          />
                        </div>
                      ) : (
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={amigo.avatar} alt={amigo.name_at} />
                          <AvatarFallback className="bg-linear-purple font-medium text-white">
                            {amigo.name_at
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {amigo.name_at}
                        </p>
                      </div>

                      <NavLink to={`/usuarios/perfil/${amigo.id}`}>
                        <Button
                          size="sm"
                          className="bg-linear-purple rounded-full"
                        >
                          Ver perfil
                        </Button>
                      </NavLink>
                    </div>
                  ) : (
                    <FollowerSkeleton />
                  )}
                </div>
              )
            })}

            {empty && (
              <p className="mb-4 flex items-center justify-center text-muted-foreground">
                Nenhum usuário encontrado
              </p>
            )}
            {hasMoreFriend && <div ref={loadMoreRef} className="h-12" />}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="mb-4 flex items-center justify-center text-muted-foreground">
              Nenhum usuário encontrado
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
