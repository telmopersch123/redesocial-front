import { AnimatePresence, motion } from 'framer-motion'
import { Edit2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import BlockedConfirmDialog from '../components/componentsPages/componentsPerfil/BlockedConfirmDialog'
import { FollowersDialog } from '../components/componentsPages/componentsPerfil/FollowersDialog'
import { FriendsDialog } from '../components/componentsPages/componentsPerfil/FriendsDialog'
import ReportDialog from '../components/componentsPages/componentsPerfil/ReportDialog'
import { PostCardSkeleton } from '../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostComponent from '../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { useAuth } from '../context/getMe'
import { usePosts } from '../context/PostsContext'
import { useInfiniteScroll } from '../hooks/effectsSkeletons'
import { getPostsByPerfilUser, getPostsByUser } from '../services/authService'
import type { Post, UserTypeSearch } from '../types'

const PerfilUsuario = () => {
  const { user: authUser } = useAuth()
  const { id } = useParams<{ id?: string }>()
  const [profileUser, setProfileUser] = useState<UserTypeSearch | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(10)
  const [loadedCount, setLoadedCount] = useState(10)
  const { posts, setPosts } = usePosts()
  let hasMore = false
  if (posts.length > 0) {
    hasMore = visibleCount < posts.length
  }
  const { loadMoreRef } = useInfiniteScroll({
    totalItems: posts.length,
    itemsPerPage: 10,
    delayInMs: 1000,
    rootMargin: '600px',
    enabled: hasMore,
    onLoadMore: () => {
      const nextDisplay = Math.min(visibleCount + 10, posts.length)
      setVisibleCount(nextDisplay)
      setTimeout(() => {
        setLoadedCount(nextDisplay)
      }, 1000)
    },
  })

  const euUsuario = !id || profileUser?.id === authUser?.id

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)

        const endpoint = id ? `/auth/users/${id}` : `/auth/me`

        const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
          credentials: 'include',
        })

        if (!res.ok) {
          setProfileUser(null)
          return
        }

        const data = await res.json()
        setProfileUser(data.user)
      } catch (err) {
        setProfileUser(null)
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  useEffect(() => {
    async function fetchPosts() {
      if (!profileUser) return
      try {
        let postsData: Post[] = []
        if (euUsuario) {
          postsData = await getPostsByPerfilUser(authUser?.id)
        } else {
          if (!profileUser.id) return
          postsData = await getPostsByUser(profileUser.id.toString())
        }

        const normalizedPosts = postsData.map((post: Post) => ({
          ...post,
          likedByMe: post.likedByMe ?? false,
          saved: Array.isArray(post.saves) ? post.saves.length > 0 : false,
        }))

        setPosts(normalizedPosts)
      } catch (err) {
        console.log(err)
        setPosts([])
      }
    }
    fetchPosts()
  }, [authUser, euUsuario, profileUser])

  if (loading) {
    return <div>Carregando perfil...</div>
  }

  return profileUser ? (
    <div className="mb-4 min-h-screen w-[99vw] overflow-hidden px-0.5 md:w-[calc(100vw-20rem)] xl:px-5 2xl:w-full">
      {/* Header do Perfil */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b px-5 pb-10 pt-8"
      >
        <div>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end">
            {/* Avatar com hover de edição */}
            <div className="flex flex-col items-center">
              <div className="group relative">
                <Avatar className="h-28 w-28 shadow-2xl ring-4 ring-white dark:ring-zinc-900 sm:h-32 sm:w-32">
                  <AvatarImage
                    src="https://i.pravatar.cc/300"
                    alt="Carlos Almeida"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white">
                    CA
                  </AvatarFallback>
                </Avatar>
                {euUsuario && (
                  <NavLink to="config">
                    <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                      <Edit2 className="h-8 w-8 text-white" />
                      <p className="text-white">Editar</p>
                    </div>
                  </NavLink>
                )}
              </div>

              {euUsuario ? (
                <div className="mt-2">
                  <NavLink to="config">
                    <Button className="cursor-pointer select-none rounded-lg bg-white text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-purple-600 hover:shadow-lg dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-purple-400">
                      Configurações
                    </Button>
                  </NavLink>
                </div>
              ) : (
                <BlockedConfirmDialog />
              )}
            </div>

            {/* Info do usuário */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                {profileUser && profileUser.name_at}
              </h1>
              <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                @carlosalmeida
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                Aqui compartilho minha jornada com a ansiedade e o crescimento
                pessoal
              </p>

              {/* Stats */}
              <div className="mt-5 flex gap-8 text-sm">
                <FriendsDialog euUsuario={euUsuario || false} />
                <FollowersDialog euUsuario={euUsuario || false} />
              </div>
            </div>

            {!euUsuario && (
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <ReportDialog />
                <Button className="bg-linear-purple rounded-full px-8 font-semibold shadow-md hover:shadow-lg">
                  Seguir
                </Button>
                <NavLink to={`/mensagens/1`}>
                  <Button
                    variant="outline"
                    className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30"
                  >
                    Mensagem
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <Separator className="mb-4 dark:bg-zinc-800" />

      {/* Feed de Posts */}
      <main>
        <div className="flex flex-col space-y-24">
          {posts.length > 0 ? (
            <>
              {posts.slice(0, visibleCount).map((post, index) => {
                const isLoaded = index < loadedCount

                return (
                  <motion.div
                    key={`${post.id}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: isLoaded ? index * 0.05 : 0,
                      duration: 0.4,
                    }}
                  >
                    {isLoaded ? (
                      <CardsPostComponent
                        posts={posts}
                        valuePost={post}
                        setPosts={setPosts}
                      />
                    ) : (
                      <PostCardSkeleton />
                    )}
                  </motion.div>
                )
              })}

              {visibleCount < posts.length && (
                <div ref={loadMoreRef} className="col-span-2 h-10" />
              )}
            </>
          ) : (
            <div>
              <p className="text-center text-zinc-600 dark:text-zinc-300">
                Nenhum post encontrado
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  ) : (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="flex items-center space-x-2 rounded-xl border border-red-300 bg-white px-6 py-4 text-red-600 shadow-lg dark:border-red-700 dark:bg-[#1a1a1a] dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-semibold">Usuário não encontrado</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PerfilUsuario
