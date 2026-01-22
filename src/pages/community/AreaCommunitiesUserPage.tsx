'use client'

import { MessageCircleHeart, Settings, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/button'

import CardsPostCommunityComponent from '../../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import PostComponentDialog from '../../components/componentsPages/PostsComponent.tsx/PostComponentDialog'
import UsersCommunityDialog from '../../components/componentsPages/componentsComunidadeUsuario/UsersCommunityDialog'
import { PostCardSkeleton } from '../../components/componentsPages/componentsPerfil/Skeleton'
import { TooltipComponent } from '../../components/globalcomponents/tooltipComponent'
import { useCriarPostDialog } from '../../context/ContextDialogPost'
import { useAuth } from '../../context/getMe'
import { useInfiniteScroll } from '../../hooks/effectsSkeletons'
import { getCommunityPosts } from '../../services/authService'
import type { Post } from '../../types'

// export const postsFicticiosCommunity: Post[] = [
//   {
//     id: 7,
//     feelingPost: 'Ansioso',
//     community: 'Mindfulness',
//     autor: 'Anônimo',
//     avatar: null,
//     friend: false,
//     description: 'Hoje consegui meditar por 15 minutos e foi libertador!',
//     mediaUrl:
//       'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
//     createdAt: new Date('2025-11-10T14:30:00'),
//     likesCount: 24,
//     comments: [
//       {
//         id: 1,
//         user: { name_at: 'Clara', id: 'user-1' } as UserTypeSearch,
//         content: 'Inspirador! Vou tentar hoje mesmo.',
//       },
//     ],
//     saves: [],
//     tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
//     mediaType: null,
//     updatedAt: '2025-11-10T14:30:00',
//     likedByMe: false,
//     user: { name_at: 'Anônimo', id: 'user-1' } as UserTypeSearch,
//     likes: [],
//     saved: false,
//     _count: { likes: 24 },
//   },
// ]

export const normalizeURL = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/&/g, 'e') // troca & por "e" (opcional, mas recomendado)
    .replace(/\s+/g, '-') // troca espaços por "-"
    .toLowerCase()
const ficticioAdminComunidade = true

export default function AreaCommunitiesUserPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [novoComentario, setNovoComentario] = useState('')
  const [loadedCount, setLoadedCount] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const pathname = useLocation().pathname
  const location = useLocation()
  const communityIdFromState = location.state?.communityId
  const { setOpenDialogPostNotification, openDialogPostNotification } =
    useCriarPostDialog()
  // const hasMore = visibleCount < posts.length
  const { loadMoreRef } = useInfiniteScroll({
    totalItems: posts.length,
    enabled: hasMore && !isLoading,
    rootMargin: '600px',
    onLoadMore: () => {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    },

    // itemsPerPage: 10,
    // delayInMs: 1000,
    // rootMargin: '600px',
    // enabled: hasMore,
    // onLoadMore: () => {
    //   const nextDisplay = Math.min(visibleCount + 10, posts.length)
    //   setVisibleCount(nextDisplay)
    //   setTimeout(() => {
    //     setLoadedCount(nextDisplay)
    //   }, 1000)
    // },
  })

  // if (communityName) {
  //   const comunidadeValida = comunidadesFicticias.some((c) => {
  //     return normalizeURL(c) === normalizeURL(communityName || '')
  //   })
  //   if (!comunidadeValida)
  //     return (
  //       <Navigate
  //         to="/comunidades"
  //         replace
  //         state={{ communityError: 'not-found' }}
  //       />
  //     )
  // }

  const fetchPosts = async (
    pageNumber: number,
    isFirstLoad: boolean = false
  ) => {
    setIsLoading(true)
    try {
      const communityUrlName = pathname.split('/').pop()
      const targetId = communityIdFromState || 0
      const postsData: Post[] = await getCommunityPosts(
        targetId,
        communityUrlName,
        pageNumber
      )
      if (postsData.length < 10) {
        setHasMore(false) // Se veio menos de 10, o banco acabou
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
      if (isFirstLoad) setPosts([])
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    fetchPosts(1, true)
  }, [communityIdFromState, pathname])

  console.log(posts)
  return (
    <>
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
            {ficticioAdminComunidade && (
              <NavLink to={'config'}>
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
            <UsersCommunityDialog />
          </div>

          <div className="min-h-[600px] space-y-24">
            {posts.length === 0 && isLoading ? (
              <div className="space-y-10">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post.id}>
                  {index < loadedCount ? (
                    <CardsPostCommunityComponent
                      posts={posts}
                      valuePost={post}
                      setPosts={setPosts}
                    />
                  ) : (
                    <PostCardSkeleton />
                  )}
                </div>
              ))
            ) : (
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
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="col-span-2 flex h-20 justify-center"
              >
                {isLoading && <PostCardSkeleton />}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
