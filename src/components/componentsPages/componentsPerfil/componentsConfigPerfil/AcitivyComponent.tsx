import { Bookmark, Heart, MessageCircleMore } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useAuth } from '../../../../context/getMe'
import { usePosts } from '../../../../context/PostsContext'
import {
  getLikedPosts,
  getMessagePosts,
  getSavedPosts,
} from '../../../../services/authService'
import type { Post } from '../../../../types'
import { LoadingComponent } from '../../../../utils/components/Loading'
import { Button } from '../../../ui/button'
import PaginationComponent from '../../componentsComunidade/PaginationComponent'

interface TypeSaved {
  id: string
  post: Post
  postId: string
  userId: string
}

interface ActivityComponentProps {
  setOpenDialogPost: Dispatch<SetStateAction<boolean>>
  openDialogPost: boolean
}

export const ActivityComponent = ({
  setOpenDialogPost,
  openDialogPost,
}: ActivityComponentProps) => {
  const [tab, setTab] = useState<'saved' | 'liked' | 'comment'>('saved')

  const [savedPosts, setSavedPosts] = useState<TypeSaved[]>([])
  const [likedPosts, setLikedPosts] = useState<TypeSaved[]>([])
  const [commentedPosts, setCommentedPosts] = useState<Post[]>([])

  const [loadingSaved, setLoadingSaved] = useState(true)
  const [loadingLiked, setLoadingLiked] = useState(true)
  const [loadingCommented, setLoadingCommented] = useState(true)
  const [showError, setShowError] = useState(false)

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const handleTabChange = (newTab: 'saved' | 'liked' | 'comment') => {
    if (newTab === tab) return
    setTab(newTab)
    setCurrentPage(1)

    if (newTab === 'saved') setLoadingSaved(true)
    if (newTab === 'liked') setLoadingLiked(true)
    if (newTab === 'comment') setLoadingCommented(true)
  }

  useEffect(() => {
    async function fetchByTab() {
      try {
        setShowError(false)

        if (tab === 'saved') setLoadingSaved(true)
        if (tab === 'liked') setLoadingLiked(true)
        if (tab === 'comment') setLoadingCommented(true)

        if (tab === 'saved') {
          const response = await getSavedPosts(currentPage, itemsPerPage)
          setSavedPosts(response.data)
          setTotalItems(response.total)

          setLoadingSaved(false)
        }

        if (tab === 'liked') {
          const response = await getLikedPosts(currentPage, itemsPerPage)
          setLikedPosts(response.data)

          setTotalItems(response.total)
          setLoadingLiked(false)
        }

        if (tab === 'comment') {
          const response = await getMessagePosts(currentPage, itemsPerPage)
          setCommentedPosts(response.data)

          setTotalItems(response.total)
          setLoadingCommented(false)
        }
      } catch (err) {
        console.error(err)
        setShowError(true)
        setLoadingSaved(false)
        setLoadingLiked(false)
        setLoadingCommented(false)
      }
    }

    fetchByTab()
  }, [tab, openDialogPost, currentPage])
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            tab === 'saved'
              ? 'bg-purple-600 text-white shadow-md dark:bg-purple-600'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => {
            handleTabChange('saved')
          }}
        >
          <Bookmark className="h-5 w-5" />
          <span className="hidden sm:block">Salvos</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            tab === 'liked'
              ? 'bg-red-600 text-white shadow-md dark:bg-red-600'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => {
            handleTabChange('liked')
          }}
        >
          <Heart className="h-5 w-5" />
          <span className="hidden sm:block">Curtidos</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            tab === 'comment'
              ? 'bg-purple-600 text-white shadow-md dark:bg-purple-600'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => {
            handleTabChange('comment')
          }}
        >
          <MessageCircleMore className="h-5 w-5" />
          <span className="hidden sm:block">Comentários</span>
        </Button>
      </div>
      <div className="min-h-[400px]">
        {tab === 'saved' && (
          <SavedPostList
            setOpenDialogPost={setOpenDialogPost}
            savedPosts={savedPosts}
            showError={showError}
            loading={loadingSaved}
          />
        )}

        {tab === 'liked' && (
          <LikedPostList
            setOpenDialogPost={setOpenDialogPost}
            likedPosts={likedPosts}
            showError={showError}
            loading={loadingLiked}
          />
        )}

        {tab === 'comment' && (
          <CommentedPostList
            setOpenDialogPost={setOpenDialogPost}
            commentedPosts={commentedPosts}
            showError={showError}
            loading={loadingCommented}
          />
        )}
      </div>

      {totalItems > itemsPerPage && (
        <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <PaginationComponent
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            itemsSimulator={totalItems}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

const SavedPostList = ({
  setOpenDialogPost,
  savedPosts,
  showError,
  loading,
}: {
  setOpenDialogPost: Dispatch<SetStateAction<boolean>>
  savedPosts: TypeSaved[]
  showError: boolean
  loading: boolean
}) => {
  if (showError) {
    return (
      <EmptyState message="Erro ao carregar os posts. Tente novamente mais tarde." />
    )
  }

  if (loading) {
    return (
      <div className="mt-10">
        <LoadingComponent />
      </div>
    )
  }

  if (savedPosts.length === 0) {
    return <EmptyState message="Nenhum post salvo encontrado." />
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {savedPosts.map((post) => (
        <PostCard
          key={post.id}
          setOpenDialogPost={setOpenDialogPost}
          posts={post.post}
        />
      ))}
    </div>
  )
}

const LikedPostList = ({
  setOpenDialogPost,
  likedPosts,
  showError,
  loading,
}: {
  setOpenDialogPost: Dispatch<SetStateAction<boolean>>
  likedPosts: TypeSaved[]
  showError: boolean
  loading: boolean
}) => {
  if (showError) {
    return (
      <EmptyState message="Erro ao carregar os posts. Tente novamente mais tarde." />
    )
  }

  if (loading) {
    return (
      <div className="mt-10">
        <LoadingComponent />
      </div>
    )
  }

  if (likedPosts.length === 0) {
    return <EmptyState message="Nenhum post curtido encontrado." />
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {likedPosts.map((post) => (
        <PostCard
          key={post.id}
          setOpenDialogPost={setOpenDialogPost}
          posts={post.post}
        />
      ))}
    </div>
  )
}

const CommentedPostList = ({
  setOpenDialogPost,
  commentedPosts,
  showError,
  loading,
}: {
  setOpenDialogPost: Dispatch<SetStateAction<boolean>>
  commentedPosts: Post[]
  showError: boolean
  loading: boolean
}) => {
  if (showError) {
    return (
      <EmptyState message="Erro ao carregar os posts. Tente novamente mais tarde." />
    )
  }

  if (loading) {
    return (
      <div className="mt-10">
        <LoadingComponent />
      </div>
    )
  }

  if (commentedPosts.length === 0) {
    return <EmptyState message="Nenhum post comentado encontrado." />
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {commentedPosts.map((post) => (
        <PostCard
          key={post.id}
          setOpenDialogPost={setOpenDialogPost}
          posts={post}
        />
      ))}
    </div>
  )
}

const PostCard = ({
  setOpenDialogPost,
  posts,
}: {
  setOpenDialogPost?: Dispatch<SetStateAction<boolean>>
  posts: Post
}) => {
  const { setSelectedPost, setPosts } = usePosts()
  const { user } = useAuth()
  return (
    <div
      onClick={() => {
        const normalizedPosts: Post = {
          ...posts,
          likedByMe:
            posts.likes?.some((l) => l.userId === Number(user?.id)) ?? false,
          saved: Array.isArray(posts.saves) ? posts.saves.length > 0 : false,
          likesCount: posts._count?.likes || 0,
        }
        setSelectedPost(normalizedPosts)
        setPosts((prev) => {
          const exists = prev.some((p) => p.id === posts.id)
          return exists ? prev : [posts, ...prev]
        })
        if (setOpenDialogPost) setOpenDialogPost(true)
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="h-28 w-full overflow-hidden sm:h-32">
        {posts.mediaType === 'image' && (
          <>
            <img
              src={posts.mediaUrl}
              alt="Prévia da imagem"
              className="max-h-60 w-full rounded-lg object-cover"
            />
          </>
        )}

        {posts.mediaType === 'video' && (
          <video
            src={posts.mediaUrl}
            muted
            playsInline
            className="max-h-60 w-full rounded-lg"
          />
        )}
      </div>
      <div className="line-clamp-2 p-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {posts.description}
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex w-full items-center justify-center py-16 text-center">
    <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
  </div>
)
