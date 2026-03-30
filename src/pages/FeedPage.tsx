import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { PostCardSkeleton } from '../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostComponent from '../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import PostComponentDialog from '../components/componentsPages/PostsComponent.tsx/PostComponentDialog'
import { Button } from '../components/ui/button'
import { useChat } from '../context/ChatContext'
import { useCriarPostDialog } from '../context/ContextDialogPost'
import { useInfiniteScroll } from '../hooks/effectsSkeletons'
import { getPostsFeed } from '../services/authService'
import type { Post, PostType } from '../types'

const feelings: PostType[] = [
  'todos',
  'feliz',
  'esperancoso',
  'ansioso',
  'agradecido',
  'triste',
]
export const gradientMap = {
  todos:
    'from-gray-100 via-gray-50 to-gray-100 dark:from-[#1a1a1a] dark:via-[#1c1c1c] dark:to-[#1a1a1a]',
  feliz:
    'from-yellow-100 via-yellow-50 to-amber-100 dark:from-[#2a2a1a] dark:via-[#2f2f1c] dark:to-[#2a2a1a]',
  esperancoso:
    'from-green-100 via-emerald-50 to-green-200 dark:from-[#1a2a1a] dark:via-[#1c2f1c] dark:to-[#1a2a1a]',
  ansioso:
    'from-violet-100 via-purple-50 to-violet-200 dark:from-[#221a2a] dark:via-[#251c30] dark:to-[#221a2a]',
  agradecido:
    'from-sky-100 via-blue-50 to-indigo-100 dark:from-[#1a1f2a] dark:via-[#1c2230] dark:to-[#1a1f2a]',
  triste:
    'from-blue-200 via-slate-50 to-blue-300 dark:from-[#1a1e2a] dark:via-[#1c2030] dark:to-[#1a1e2a]',
}

const emojiMap: Record<string, string> = {
  todos: '🌍',
  feliz: '😊',
  esperancoso: '🌱',
  ansioso: '😰',
  agradecido: '🙏',
  triste: '😢',
}

const TextMap: Record<string, string> = {
  todos: 'Todos',
  feliz: 'Feliz',
  esperancoso: 'Esperançoso',
  ansioso: 'Ansioso',
  agradecido: 'Agradecido',
  triste: 'Triste',
}

const FeedPage = () => {
  const isInitialMount = useRef(true)
  const { isChatOpenChatSideBar, clickedState } = useChat()
  const [novoComentario, setNovoComentario] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [selectedFeeling, setSelectedFeeling] = useState<PostType>('todos')
  const [hasMore, setHasMore] = useState(true)
  const {
    open,
    setPostCommunity,
    setOpenDialogPostNotification,
    openDialogPostNotification,
  } = useCriarPostDialog()

  const [loadingPostsFeed, setLoadingPostsFeed] = useState(false)

  const debouncedOnLoadMore = debounce(() => {
    if (loadingPostsFeed || !hasMore) return
    loadPosts(page)
  }, 300)

  const { loadMoreRef } = useInfiniteScroll({
    enabled: hasMore && !loadingPostsFeed,
    rootMargin: '200px 0px 0px 0px',
    threshold: 0.1,
    isLoading: loadingPostsFeed,
    onLoadMore: debouncedOnLoadMore,
  })

  const loadPosts = async (
    pageNumber: number = 1,
    isFirstLoad = false,
    feeling?: PostType
  ) => {
    if (loadingPostsFeed) return
    setLoadingPostsFeed(true)
    const currentFeeling = feeling || selectedFeeling
    try {
      const response = await getPostsFeed(pageNumber, currentFeeling)
      const newPostsList = response.posts || []

      if (newPostsList.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prev) => {
          if (isFirstLoad) return newPostsList
          const existingIds = new Set(prev.map((p) => p.id))
          const filtered = newPostsList.filter(
            (p: Post) => !existingIds.has(p.id)
          )
          return [...prev, ...filtered]
        })
        setPage(pageNumber + 1)
      }
    } catch (err) {
      console.error('Erro na UI do feed')
    } finally {
      setLoadingPostsFeed(false)
    }
  }
  useEffect(() => {
    if (isInitialMount.current) {
      loadPosts(1, true, selectedFeeling)
      isInitialMount.current = false
    }
  }, [])

  const handleFilterChange = (feeling: PostType) => {
    setSelectedFeeling(feeling)
    setPage(1)
    setHasMore(true)
    setPosts([])
    loadPosts(1, true, feeling)
  }

  console.log(clickedState)

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

      <div
        className={`mb-4 mt-5 w-[99vw] px-0.5 sm:px-5 md:w-[calc(100vw-20rem)] 2xl:w-[1000px]`}
      >
        <img
          src="/logo.png"
          alt="Logo da Rede Social"
          width={100}
          height={100}
          className="mx-auto rounded-2xl md:hidden"
        />

        <p className="text-1xl text-muted-foreground dark:text-gray-300 sm:text-left">
          Um espaço seguro para compartilhar e apoiar 💙
        </p>

        <Button
          onClick={() => {
            open()
            setPostCommunity(false)
          }}
          className="bg-linear-purple mx-auto mt-5 w-full rounded-xl border-none p-7 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-md"
        >
          + Como você está se sentindo?
        </Button>

        <div
          className="m-auto mt-3 flex w-full justify-between overflow-x-auto whitespace-nowrap rounded-lg bg-white/50 p-2 shadow-sm backdrop-blur-md dark:bg-white/10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {feelings.map((feeling: PostType) => {
            const isSelected = selectedFeeling === feeling
            return (
              <p
                key={feeling}
                onClick={() => handleFilterChange(feeling)}
                className={`m-1 cursor-pointer rounded-full px-5 py-2 font-semibold transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${gradientMap[feeling]} scale-105 text-gray-800 shadow-md dark:text-white`
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
                } `}
              >
                {emojiMap[feeling]} {TextMap[feeling]}
              </p>
            )
          })}
        </div>

        <div className="mt-12 space-y-24">
          {posts.length > 0 ? (
            <>
              {posts.map((post: Post) => (
                <div key={post.id}>
                  <CardsPostComponent
                    posts={posts}
                    valuePost={post}
                    setPosts={setPosts}
                  />
                </div>
              ))}
              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex min-h-[300px] items-center justify-center"
                >
                  {loadingPostsFeed && (
                    <div className="w-full animate-pulse">
                      <PostCardSkeleton />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : loadingPostsFeed ? (
            <div className="space-y-10">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="m-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eeeefa] p-3 text-4xl dark:bg-white/10">
                🌱
              </p>
              <p className="mt-5 text-xs font-semibold text-muted-foreground dark:text-gray-300 sm:text-xl">
                Nenhum post ainda. Seja o primeiro a compartilhar!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FeedPage
