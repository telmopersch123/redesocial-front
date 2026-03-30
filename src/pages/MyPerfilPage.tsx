import { AnimatePresence, motion } from 'framer-motion'
import { debounce } from 'lodash'
import Lottie from 'lottie-react'
import { Edit2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { NavLink } from 'react-router-dom'
import notfounduser from '../assets/animations/notfounduser.json'
import {
  PostCardSkeleton,
  ProfileHeaderSkeleton,
} from '../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostComponent from '../components/componentsPages/PostsComponent.tsx/CardsPostComponent'

import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { useAuth } from '../context/getMe'

import { FriendsDialog } from '../components/componentsPages/componentsPerfil/FriendsDialog'
import { useMyProfile } from '../context/MyProfileContext'
import { usePosts } from '../context/PostsContext'
import { useInfiniteScroll } from '../hooks/effectsSkeletons'
import { getPostsByPerfilUser } from '../services/authService'
import type { Post } from '../types'
import { UserAvatar } from '../utils/components/UserAvatar'

const MyPerfilPage = () => {
  const { user: authUser, isAuthLoading } = useAuth()
  const {
    bio,
    myProfile: profileUser,
    isMyLoading: loading,
    setMyProfile: setProfileUser,
    nomeUser,
  } = useMyProfile()

  const [page, setPage] = useState(1)
  const loadingRef = useRef(false)
  const [loadedCount, setLoadedCount] = useState(10)
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const { posts, setPosts } = usePosts()
  const debouncedOnLoadMore = debounce(() => {
    if (isLoadingSkeleton || !hasMore || posts.length < 5 || loadingRef.current)
      return
    setPage((prev) => {
      const next = prev + 1
      fetchPosts(next)
      return next
    })
  }, 300)

  const { loadMoreRef } = useInfiniteScroll({
    enabled: hasMore && !isLoadingSkeleton,
    rootMargin: '200px 0px 0px 0px',
    threshold: 0.1,
    isLoading: isLoadingSkeleton,
    onLoadMore: debouncedOnLoadMore,
  })

  const fetchPosts = async (
    pageNumber: number,
    isFirstLoad: boolean = false
  ) => {
    if (!profileUser && !isFirstLoad) return
    if (loadingRef.current) return

    loadingRef.current = true
    setIsLoadingSkeleton(true)
    try {
      let postsData: Post[] = []
      postsData = await getPostsByPerfilUser(authUser?.id, pageNumber)

      if (postsData.length < 10) {
        setHasMore(false)
      }

      if (isFirstLoad) {
        setPosts(postsData)
      } else {
        setPosts((prev) => [...prev, ...postsData])
      }
      setLoadedCount((prev) => (isFirstLoad ? 10 : prev + 10))
    } catch (err) {
      setIsLoadingSkeleton(false)
      console.log(err)
      setPosts([])
      setHasMore(false)
    } finally {
      loadingRef.current = false
      setIsLoadingSkeleton(false)
    }
  }

  useEffect(() => {
    if (profileUser && nomeUser && profileUser.name_at !== nomeUser) {
      setProfileUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          user: {
            ...prev,
            name_at: nomeUser,
          },
        }
      })
    }
  }, [nomeUser])

  useEffect(() => {
    if (isAuthLoading || !authUser?.id) return
    setPosts([])
    setPage(1)
    setHasMore(true)
    setLoadedCount(10)
    setIsLoadingSkeleton(true)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // refreshProfile()
  }, [isAuthLoading, authUser?.id])

  useEffect(() => {
    if (loading || !profileUser?.id || !authUser?.id) return
    if (page !== 1) return
    fetchPosts(1, true)
  }, [profileUser?.id, authUser?.id, page, loading])

  if (loading) {
    return (
      <div className="mt-10">
        <ProfileHeaderSkeleton />
        <div className="mt-10">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    )
  }

  if (profileUser) {
    return (
      <div className="my-6 min-h-screen w-[99vw] overflow-hidden px-0.5 md:w-[calc(100vw-20rem)] xl:px-5 2xl:w-full">
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
                  <UserAvatar
                    url={profileUser.avatar || undefined}
                    name={profileUser.name}
                    className="h-28 w-28 shadow-2xl ring-4 ring-white dark:ring-zinc-900 sm:h-32 sm:w-32"
                  />
                  <NavLink to="config">
                    <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                      <Edit2 className="h-8 w-8 text-white" />
                      <p className="text-white">Editar</p>
                    </div>
                  </NavLink>
                </div>

                <div className="mt-2">
                  <NavLink to="config">
                    <Button className="cursor-pointer select-none rounded-lg bg-white text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-purple-600 hover:shadow-lg dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-purple-400">
                      Configurações
                    </Button>
                  </NavLink>
                </div>
              </div>

              {/* Info do usuário */}
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                  {profileUser && profileUser.name}
                </h1>
                <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                  @{profileUser && profileUser.name_at}
                </p>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300 sm:max-w-lg">
                  {profileUser && bio}
                </p>

                {/* Stats */}
                <div className="mt-5 flex gap-8 text-sm">
                  <FriendsDialog
                    username={profileUser.name_at}
                    profileId={Number(profileUser.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <Separator className="mb-4 dark:bg-zinc-800" />

        {/* Feed de Posts */}
        <main>
          <div className="flex w-auto flex-col space-y-24 tm:w-[1000px] max:w-[1500px]">
            {posts.length > 0 && !loading ? (
              <>
                {posts.map((post, index) => {
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
                      {isLoaded && (
                        <CardsPostComponent
                          posts={posts}
                          valuePost={post}
                          setPosts={setPosts}
                        />
                      )}
                    </motion.div>
                  )
                })}
                {hasMore && authUser && (
                  <div
                    ref={loadMoreRef}
                    className="flex min-h-[300px] items-center justify-center"
                  >
                    {isLoadingSkeleton && (
                      <div className="w-full animate-pulse">
                        <PostCardSkeleton />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              isLoadingSkeleton && (
                <>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </>
              )
            )}

            {posts.length === 0 && !isLoadingSkeleton && (
              <div className="mt-20 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Nenhum post encontrado
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Parece que você ainda não fez nenhum post.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50/80 p-4 backdrop-blur-sm dark:bg-zinc-950/80"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex max-w-md flex-col items-center text-center"
        >
          {/* Container da Animação Lottie */}
          <div className="h-64 w-64 sm:h-80 sm:w-80">
            <Lottie
              animationData={notfounduser}
              loop={true}
              className="h-full w-full"
            />
          </div>

          <div className="mt-2 space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Ops! Usuário sumiu?
            </h2>
            <p className="font-medium text-zinc-600 dark:text-zinc-400">
              Não conseguimos encontrar ninguém com esse identificador. O perfil
              pode ter sido alterado ou não existe mais.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <NavLink to="/">
              <Button
                variant="outline"
                className="rounded-full border-zinc-300 px-8 font-bold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Voltar
              </Button>
            </NavLink>
            <NavLink to="/auth">
              <Button className="rounded-full bg-purple-600 px-8 font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700">
                Fazer Login
              </Button>
            </NavLink>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MyPerfilPage
