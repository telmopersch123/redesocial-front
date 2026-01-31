'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArchiveX, ExternalLink, MessageCircleHeart } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

import { PostCardSkeleton } from '../../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostCommunityComponent from '../../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog' // supondo que você tenha shadcn/ui Dialog

import { useAuth } from '../../context/getMe'
import { useRefreshPermission } from '../../context/RefreshPermissionContext'

import { getArchivedPostsCommunity } from '../../services/authService'
import type { Post } from '../../types'

// Tipagem melhorada e mais segura
interface ArchivedPostData {
  id: number
  reason: string
  createdAt: string
  mediaType: 'image' | 'video' | null
  mediaUrl: string | null
  archivedBy: {
    id: number
    name: string
    name_at: string
    avatar: string | null
  }
  post: Post & {
    likes?: Array<{ userId: number }>
    saves?: Array<any>
    _count?: { likes: number }
  }
}

export interface ExtendedPost extends Post {
  archivedId?: number
  archivedReason?: string
  archivedAt?: string
  archivedBy?: {
    id: number
    name: string
    name_at: string
    avatar: string | null
  }
  evidenceMediaType?: 'image' | 'video' | null
  evidenceMediaUrl?: string | null
  likedByMe: boolean // já existe em vários lugares, pode manter obrigatório
  saved: boolean
  likesCount: number
}

export const PostsArchived = () => {
  const { user } = useAuth()
  const { permissionRefresh } = useRefreshPermission()
  const location = useLocation()
  const navigate = useNavigate()

  const communityId = location.state?.communityId as number | undefined
  const communityName = location.state?.communityName as string | undefined

  const [posts, setPosts] = useState<ExtendedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvidence, setSelectedEvidence] = useState<ExtendedPost | null>(
    null
  )

  const fetchArchivedPosts = async () => {
    if (!communityId) {
      toast.error('ID da comunidade não encontrado')
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const data: ArchivedPostData[] =
        await getArchivedPostsCommunity(communityId)

      const normalized = data.map((archived) => ({
        ...archived.post,
        archivedId: archived.id,
        archivedReason: archived.reason,
        archivedAt: archived.createdAt,
        archivedBy: archived.archivedBy,
        evidenceMediaType: archived.mediaType,
        evidenceMediaUrl: archived.mediaUrl,
        likedByMe:
          archived.post.likes?.some((l) => l.userId === Number(user?.id)) ??
          false,
        saved: !!archived.post.saves?.length,
        likesCount: archived.post._count?.likes ?? 0,
      }))

      setPosts(normalized)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar posts arquivados')
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedPosts()
  }, [communityId, permissionRefresh])

  if (!communityId) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
          Comunidade não identificada
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Volte para a página da comunidade e acesse a seção de posts arquivados
          de lá.
        </p>
        <Button className="mt-6" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="my-10 min-h-screen w-[100vw] md:w-[60vw]">
      <div className="mx-auto w-full max-w-[70vw] px-5 sm:px-6 lg:max-w-none lg:px-10 xl:px-16">
        {/* Header */}
        <header className="mb-10 flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-100 shadow-sm dark:bg-zinc-800">
            <ArchiveX className="h-7 w-7 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Posts Arquivados
            </h1>
            <div className="mt-1 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Conteúdos ocultos por moderação</span>
              {communityName && (
                <span className="rounded-full bg-zinc-200/80 px-3 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200">
                  {communityName}
                </span>
              )}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-10 pt-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-16 flex min-h-[60vh] flex-col items-center justify-center gap-8 rounded-2xl border border-zinc-200 px-6 py-20 text-center shadow-sm dark:border-zinc-800">
            <MessageCircleHeart
              className="h-16 w-16 text-zinc-400 dark:text-zinc-600"
              strokeWidth={1.6}
            />
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                Nenhum post arquivado
              </p>
              <p className="max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Quando um conteúdo for arquivado por um moderador, ele aparecerá
                aqui para análise.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900/50"
              onClick={() => navigate(-1)}
            >
              Voltar para a comunidade
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:hover:shadow-zinc-950/40"
              >
                {/* Bloco de moderação - layout profissional */}
                <div className="relative border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  {/* Data no canto superior direito */}
                  {post.archivedAt && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDistanceToNow(new Date(post.archivedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  )}

                  <div className="flex flex-col gap-4 pr-28">
                    {' '}
                    {/* pr-28 reserva espaço pra data */}
                    {/* Motivo alinhado à esquerda, bem integrado */}
                    <div className="max-h-[200px] w-[50vw] overflow-y-auto break-words text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                      <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                        Motivo:{' '}
                      </span>
                      {post.archivedReason}{' '}
                      KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
                      KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
                      KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
                    </div>
                    {/* Quem arquivou */}
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      Pelo moderador{' '}
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {post.archivedBy?.name_at || post.archivedBy?.name}
                      </span>
                    </div>
                  </div>

                  {/* Ver evidência no canto inferior direito */}
                  {post.evidenceMediaUrl && (
                    <div className="relative sm:absolute sm:bottom-0 sm:right-1">
                      <button
                        onClick={() => setSelectedEvidence(post)}
                        className="flex items-center gap-1.5 rounded-md px-0 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 hover:text-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 sm:px-1.5"
                      >
                        Ver evidência
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <CardsPostCommunityComponent
                    posts={posts}
                    valuePost={post}
                    setPosts={setPosts}
                    communityShowButtonArchived={true}
                    postsArchived={true}
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal - mantido com imagem bem exibida */}
        <Dialog
          open={!!selectedEvidence}
          onOpenChange={() => setSelectedEvidence(null)}
        >
          <DialogContent className="h-[92vh] w-[92vw] max-w-none overflow-hidden rounded-2xl border border-zinc-200 p-0 shadow-2xl dark:border-zinc-800">
            <div className="flex h-full flex-col">
              <DialogHeader className="shrink-0 border-b border-zinc-200 px-7 py-4 dark:border-zinc-800">
                <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Evidência do arquivamento
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedEvidence?.archivedReason}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-hidden p-6">
                {selectedEvidence?.evidenceMediaUrl && (
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50/40 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <img
                      src={selectedEvidence.evidenceMediaUrl}
                      alt="Evidência do arquivamento"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-zinc-200 px-7 py-4 dark:border-zinc-800">
                <div className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    Enviado por{' '}
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {selectedEvidence?.archivedBy?.name_at ||
                        selectedEvidence?.archivedBy?.name}
                    </span>{' '}
                    •{' '}
                    {selectedEvidence?.archivedAt &&
                      formatDistanceToNow(
                        new Date(selectedEvidence.archivedAt),
                        {
                          addSuffix: true,
                          locale: ptBR,
                        }
                      )}
                  </div>
                  <Button
                    variant="outline"
                    className="border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900/60"
                    onClick={() => setSelectedEvidence(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
