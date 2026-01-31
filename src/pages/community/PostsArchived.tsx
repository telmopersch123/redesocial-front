'use client'

import { ArchiveX, MessageCircleHeart } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

import { PostCardSkeleton } from '../../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostCommunityComponent from '../../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import { Button } from '../../components/ui/button'

import { useAuth } from '../../context/getMe'
import { useRefreshPermission } from '../../context/RefreshPermissionContext'

import { getArchivedPostsCommunity } from '../../services/authService'
import type { Post } from '../../types'

interface ArchivedPost {
  id: number
  reason: string
  createdAt: string
  mediaType: 'image' | 'video' | null
  mediaUrl: string | undefined
  archivedBy: {
    id: number
    name: string
    name_at: string
    avatar: string | null
  }
  post: Post
}

export const PostsArchived = () => {
  const { user } = useAuth()
  const { permissionRefresh } = useRefreshPermission()
  const location = useLocation()

  const communityId = location.state?.communityId
  const communityName = location.state?.communityName

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchArchivedPosts = async () => {
    if (!communityId) return

    setIsLoading(true)

    try {
      const data: ArchivedPost[] = await getArchivedPostsCommunity(communityId)
      console.log(data)

      const normalizedPosts = data.map((archived) => ({
        ...archived.post,
        archivedReason: archived.reason,
        archivedAt: archived.createdAt,
        archivedBy: archived.archivedBy,
        likedByMe:
          archived.post.likes?.some(
            (l: any) => l.userId === Number(user?.id)
          ) ?? false,
        saved: Array.isArray(archived.post.saves)
          ? archived.post.saves.length > 0
          : false,
        likesCount: archived.post._count?.likes ?? 0,
      }))

      setPosts(normalizedPosts)
    } catch (error) {
      toast.error('Erro ao buscar posts arquivados')
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedPosts()
  }, [communityId, permissionRefresh])

  return (
    <div className="mb-10 mt-10 w-[100vw] px-2 md:w-[65vw] xl:w-full">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
          <ArchiveX className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            Posts Arquivados
          </h2>
          <div className="space-x-1">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Conteúdos removidos da visualização pública da comunidade
            </span>
            <span className="mt-1 inline-flex items-center rounded-md bg-zinc-100 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {communityName}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="w-[50vw] space-y-10">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-16">
          {posts.map((post) => (
            <CardsPostCommunityComponent
              key={post.id}
              posts={posts}
              valuePost={post}
              setPosts={setPosts}
              communityShowButtonArchived={true}
              postsArchived={true}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 px-6 dark:bg-zinc-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
            <MessageCircleHeart className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
              Nenhum post arquivado
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Quando um post for arquivado, ele aparecerá aqui.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => history.back()}
            className="mt-2"
          >
            Voltar
          </Button>
        </div>
      )}
    </div>
  )
}
