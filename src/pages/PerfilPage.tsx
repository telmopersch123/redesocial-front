import { AnimatePresence, motion } from 'framer-motion'
import { debounce } from 'lodash'
import Lottie from 'lottie-react'
import { CircleCheck, Edit2, Loader2, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useParams } from 'react-router-dom'
import notfounduser from '../assets/animations/notfounduser.json'
import BlockedConfirmDialog from '../components/componentsPages/componentsPerfil/BlockedConfirmDialog'
import { FriendsDialog } from '../components/componentsPages/componentsPerfil/FriendsDialog'
import ReportDialog from '../components/componentsPages/componentsPerfil/ReportDialog'
import {
  PostCardSkeleton,
  ProfileHeaderSkeleton,
} from '../components/componentsPages/componentsPerfil/Skeleton'
import { UnFriendShipDialog } from '../components/componentsPages/componentsPerfil/unFriendShipDialog'
import CardsPostComponent from '../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import { TooltipComponent } from '../components/globalcomponents/tooltipComponent'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { useAuth } from '../context/getMe'
import { usePosts } from '../context/PostsContext'
import { useProfile } from '../context/ProfileContext'
import { useInfiniteScroll } from '../hooks/effectsSkeletons'
import {
  getPostsByPerfilUser,
  getPostsByUser,
  requestFriendship,
} from '../services/authService'
import type { Post } from '../types'
import { UserAvatar } from '../utils/components/UserAvatar'

const PerfilUsuario = () => {
  const { user: authUser } = useAuth()
  const { id } = useParams<{ id?: string }>()
  const {
    bio,
    profileUser,
    loading,
    setProfileUser,
    nomeUser,
    refreshProfile,
  } = useProfile()
  const [page, setPage] = useState(1)
  const loadingRef = useRef(false)
  const [openDialogunFriend, setOpenDialogunFriend] = useState(false)

  const [loadedCount, setLoadedCount] = useState(100)
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
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
  useEffect(() => {
    refreshProfile(Number(id) || undefined)
  }, [id, refreshProfile])
  const euUsuario = Boolean(
    !id ||
      (profileUser?.user.id !== undefined &&
        authUser?.id !== undefined &&
        Number(profileUser.user.id) === Number(authUser.id))
  )
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
      if (euUsuario) {
        postsData = await getPostsByPerfilUser(authUser?.id, pageNumber)
      } else {
        if (!profileUser || !profileUser.user.id) return
        postsData = await getPostsByUser(
          profileUser.user.id.toString(),
          pageNumber
        )
      }

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
  const RequestFollower = async (userBId: number) => {
    setIsLoadingFollow(true)
    try {
      const res = await requestFriendship(userBId)
      if (res) {
        toast.success('Solicitação enviada com sucesso!')
        refreshProfile(Number(id) || undefined)
      }
    } catch (err) {
      setIsLoadingFollow(false)
      console.log(err)
    } finally {
      setIsLoadingFollow(false)
    }
  }

  useEffect(() => {
    if (profileUser && nomeUser && profileUser.user.name_at !== nomeUser) {
      setProfileUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          user: {
            ...prev.user,
            name_at: nomeUser,
          },
        }
      })
    }
  }, [nomeUser])
  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    setLoadedCount(10)
    setIsLoadingSkeleton(true)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    fetchPosts(page, true)
  }, [authUser, euUsuario, profileUser])
  useEffect(() => {
    setPosts([])
    setHasMore(true)
    setPage(1)
    refreshProfile(Number(id))

    window.scrollTo(0, 0)
  }, [id])

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

  return profileUser ? (
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
                  url={profileUser.user.avatar || undefined}
                  name={profileUser.user.name}
                  className="h-28 w-28 shadow-2xl ring-4 ring-white dark:ring-zinc-900 sm:h-32 sm:w-32"
                />
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
                {profileUser && profileUser.user.name}
              </h1>
              <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                @{profileUser && profileUser.user.name_at}
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 sm:max-w-lg">
                {profileUser && bio}
              </p>

              {/* Stats */}
              <div className="mt-5 flex gap-8 text-sm">
                <FriendsDialog
                  username={profileUser.user.name_at}
                  profileUser={profileUser}
                />
              </div>
            </div>

            {!euUsuario && (
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <ReportDialog />
                {isLoadingFollow ? (
                  <TooltipComponent
                    description="Enviando solicitação de amizade"
                    Tag={
                      <span>
                        <Button
                          disabled
                          className="group relative overflow-hidden rounded-full bg-purple-600 px-6 py-2 font-bold text-white opacity-90 transition-all duration-300 active:scale-95"
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Enviando</span>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </Button>
                      </span>
                    }
                  />
                ) : (
                  <span>
                    <>
                      {profileUser.friendship &&
                        profileUser.friendship.IsSender &&
                        profileUser.friendship.status === 'pending' && (
                          <Button className="group relative overflow-hidden rounded-full border bg-transparent px-6 py-2 font-bold text-white transition-all duration-300 hover:bg-purple-600/10 active:scale-95">
                            <div className="flex items-center gap-2">
                              <CircleCheck className="h-4 w-4 transition-transform group-hover:rotate-12" />
                              <span>Solicitação Enviada</span>
                            </div>
                          </Button>
                        )}

                      {profileUser.friendship &&
                        profileUser.friendship.IsSender &&
                        profileUser.friendship.status === 'accepted' && (
                          <UnFriendShipDialog
                            open={openDialogunFriend}
                            setOpen={setOpenDialogunFriend}
                            username={profileUser.user.name_at}
                            idUser={profileUser.user.id}
                            refreshProfile={refreshProfile}
                          />
                        )}

                      {!profileUser.friendship && (
                        <Button
                          onClick={() => RequestFollower(profileUser.user.id)}
                          className="group relative overflow-hidden rounded-full bg-purple-600 px-6 py-2 font-bold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] active:scale-95"
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 transition-transform group-hover:rotate-12" />
                            <span>Seguir</span>
                          </div>
                        </Button>
                      )}
                    </>
                  </span>
                )}

                <NavLink
                  state={{ chatId: false }}
                  to={`/mensagens/${profileUser.user.id}`}
                  onClick={() => {
                    sessionStorage.setItem('__internal_nav', '1')
                  }}
                >
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
        <div className="flex w-auto flex-col space-y-24 tm:w-[1000px] max:w-[1500px]">
          {posts.length > 0 ? (
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
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          )}

          {posts.length === 0 && !isLoadingSkeleton && (
            <div className="mt-20 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Nenhum post encontrado
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Parece que este usuário ainda não fez nenhum post.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  ) : (
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
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="rounded-full border-zinc-300 px-8 font-bold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Voltar
            </Button>

            <NavLink to="/">
              <Button className="rounded-full bg-purple-600 px-8 font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700">
                Ir para o Início
              </Button>
            </NavLink>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PerfilUsuario
