'use client'

import { MessageCircleHeart, Settings, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'

import toast from 'react-hot-toast'
import CardsPostCommunityComponent from '../../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import PostComponentDialog from '../../components/componentsPages/PostsComponent.tsx/PostComponentDialog'
import UsersCommunityDialog from '../../components/componentsPages/componentsComunidadeUsuario/UsersCommunityDialog'
import { PostCardSkeleton } from '../../components/componentsPages/componentsPerfil/Skeleton'
import { TooltipComponent } from '../../components/globalcomponents/tooltipComponent'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { useCriarPostDialog } from '../../context/ContextDialogPost'
import { useAuth } from '../../context/getMe'
import { useInfiniteScroll } from '../../hooks/effectsSkeletons'
import {
  getCommunityDetailsByName,
  getCommunityPosts,
  joinCommunity,
  validateCommunityInvite,
} from '../../services/authService'
import type { Post } from '../../types'
export const normalizeURL = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/&/g, 'e') // troca & por "e" (opcional, mas recomendado)
    .replace(/\s+/g, '-') // troca espaços por "-"
    .toLowerCase()

export default function AreaCommunitiesUserPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { token, communityName: urlCommunityName } = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [inviteData, setInviteData] = useState<{
    id: number
    name: string
  } | null>(null)
  const [activeCommunityId, setActiveCommunityId] = useState<number | null>(
    null
  )
  const [novoComentario, setNovoComentario] = useState('')
  const [loadedCount, setLoadedCount] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const pathname = useLocation().pathname
  const location = useLocation()
  const [showSettings, setShowSettings] = useState(false)
  const communityIdFromState = location.state?.communityId
  const adminStatus = isAdmin(communityIdFromState || activeCommunityId)
  const [isInvitePending, setIsInvitePending] = useState(!!token)
  const { setOpenDialogPostNotification, openDialogPostNotification } =
    useCriarPostDialog()
  const { loadMoreRef } = useInfiniteScroll({
    totalItems: posts.length,
    enabled: hasMore && !isLoadingSkeleton,
    rootMargin: '600px',
    onLoadMore: () => {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    },
  })
  const fetchPosts = async (
    pageNumber: number,
    isFirstLoad: boolean = false
  ) => {
    if (!isLoading) {
      setIsLoadingSkeleton(true)
    }
    try {
      const communityUrlName = pathname.split('/').pop()
      const targetId = communityIdFromState || activeCommunityId

      const postsData: Post[] = await getCommunityPosts(
        targetId,
        communityUrlName,
        pageNumber
      )
      if (postsData.length < 10) {
        setHasMore(false)
      }
      const normalizedPosts = postsData.map((post: Post) => ({
        ...post,
        likedByMe:
          post.likes?.some((l: any) => l.userId === Number(user?.id)) ?? false,
        saved: Array.isArray(post.saves) ? post.saves.length > 0 : false,
        likesCount: post._count?.likes ?? 0,
      }))
      if (isFirstLoad) {
        setPosts(normalizedPosts)
      } else {
        // CONCATENA: Mantém os antigos e adiciona os novos no fim
        setPosts((prev) => [...prev, ...normalizedPosts])
      }
      setLoadedCount((prev) => (isFirstLoad ? 10 : prev + 10))
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      setIsLoadingSkeleton(false)
      if (isFirstLoad) setPosts([])
    } finally {
      setIsLoading(false)
      setIsLoadingSkeleton(false)
      setShowSettings(true)
    }
  }

  useEffect(() => {
    const resolveId = async () => {
      if (location.state?.communityId) {
        setActiveCommunityId(location.state.communityId)
        return
      }

      if (urlCommunityName) {
        try {
          const response = await getCommunityDetailsByName(urlCommunityName)
          console.log(response.id)
          setActiveCommunityId(response.id)
        } catch (err) {
          console.error('Não foi possível encontrar o ID desta comunidade')
        }
      }
    }
    resolveId()
  }, [urlCommunityName, location.state])

  useEffect(() => {
    if (activeCommunityId && !isInvitePending) {
      setPage(1)
      setHasMore(true)
      setIsLoading(true)
      fetchPosts(1, true)
      setShowSettings(false)
    }
  }, [activeCommunityId, isInvitePending])

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const data = await validateCommunityInvite(token)
          setInviteData({ id: data.communityId, name: data.communityName })
          setShowInviteModal(true)
        } catch (err) {
          toast.error('Este link de convite não é mais válido.')
          navigate(`/comunidades/comunidades-do-usuario/${urlCommunityName}`, {
            replace: true,
          })
        }
      }
    }

    checkToken()
  }, [token])

  const handleAcceptInvite = async () => {
    const targetId = inviteData?.id
    if (!targetId) {
      toast.error('Dados da comunidade não encontrados.')
      return
    }
    try {
      await joinCommunity(targetId)
      toast.success(`Bem-vindo à comunidade ${inviteData?.name}!`)
      setIsInvitePending(false)
      setShowInviteModal(false)
      navigate(`/comunidades/comunidades-do-usuario/${urlCommunityName}`, {
        replace: true,
        state: { communityId: targetId },
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('já faz parte')) {
          setIsInvitePending(false)
          setShowInviteModal(false)
          navigate(`/comunidades/comunidades-do-usuario/${urlCommunityName}`, {
            replace: true,
          })
        } else {
          toast.error(error.message || 'Erro ao entrar na comunidade.')
        }
        console.error(error)
      }
    }
  }

  return (
    <>
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Convite para Comunidade
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-gray-600 dark:text-zinc-400">
              Você foi convidado para participar da comunidade:
            </p>
            <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {inviteData?.name || urlCommunityName?.replaceAll('-', ' ')}
            </h3>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setShowInviteModal(false)
                navigate(`/comunidades`, { replace: true })
              }}
            >
              Agora não
            </Button>
            <Button
              className="bg-linear-purple text-white"
              onClick={handleAcceptInvite}
            >
              Aceitar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="fixed">
        <PostComponentDialog
          valuePosts={posts[0]}
          novoComentario={novoComentario}
          setNovoComentario={setNovoComentario}
          setPosts={setPosts}
          posts={posts}
          open={openDialogPostNotification}
          onOpenChange={setOpenDialogPostNotification}
          typePost={'NotificaçãoDialog'}
        />
      </div>
      <div className="mb-4 mt-14 w-[99vw] !overflow-hidden px-0.5 md:w-[calc(100vw-20rem)] 2xl:w-[850px]">
        <main className={`transition-all duration-300`}>
          <div
            className={`absolute right-4 top-4 flex flex-row-reverse gap-2 md:left-[270px] md:right-auto md:flex-row ${pathname === '/comunidades/comunidades-do-usuario' ? 'hidden' : ''}`}
          >
            {showSettings && (
              <>
                {adminStatus && (
                  <NavLink
                    state={{
                      communityIdState:
                        communityIdFromState ?? activeCommunityId,
                    }}
                    to={'config'}
                  >
                    <TooltipComponent
                      Tag={
                        <div className="cursor-pointer text-muted-foreground transition-colors hover:text-purple-600">
                          <Settings />
                        </div>
                      }
                      description="Configurações da Comunidade"
                    />
                  </NavLink>
                )}
                <UsersCommunityDialog
                  communityName={pathname
                    .split('/')
                    .pop()
                    ?.replaceAll('-', ' ')}
                  communityIdFromState={
                    communityIdFromState ?? activeCommunityId
                  }
                />
              </>
            )}
          </div>

          <div className="min-h-[600px] space-y-24">
            {isLoading ? (
              <div className="space-y-10">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            ) : posts.length > 0 && !isLoading ? (
              posts.map((post, index) => (
                <div key={post.id}>
                  {index < loadedCount && (
                    <CardsPostCommunityComponent
                      posts={posts}
                      valuePost={post}
                      setPosts={setPosts}
                    />
                  )}
                </div>
              ))
            ) : (
              <>
                {!isLoading && (
                  <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 px-6 dark:bg-zinc-900">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 shadow-sm dark:from-purple-900/40 dark:to-indigo-900/40 dark:shadow-none">
                      <MessageCircleHeart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700 dark:text-zinc-200">
                        Ainda não há posts
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                        Seja o primeiro a compartilhar algo ou crie uma nova
                        comunidade!
                      </p>
                    </div>

                    <NavLink to="/comunidades">
                      <Button
                        size="sm"
                        className="bg-linear-purple mt-2 text-white shadow-md hover:shadow-lg dark:shadow-none dark:hover:shadow-purple-500/20"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Visualizar Comunidades
                      </Button>
                    </NavLink>
                  </div>
                )}
              </>
            )}

            {hasMore && (
              <div ref={loadMoreRef}>
                {isLoadingSkeleton && !isLoading && <PostCardSkeleton />}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
