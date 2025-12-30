import { Bookmark, Heart, MessageCircleMore } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { getSavedPosts } from '../../../../services/authService'
import type { Post } from '../../../../types'
import { Button } from '../../../ui/button'

interface TypeSaved {
  id: string
  post: Post
  postId: string
  userId: string
}

interface ActivityComponentProps {
  setOpenDialogPost: Dispatch<SetStateAction<boolean>>
  setPosts: Dispatch<SetStateAction<Post[]>>
}

export const ActivityComponent = ({
  setPosts,
  setOpenDialogPost,
}: ActivityComponentProps) => {
  const [tab, setTab] = useState<'saved' | 'liked' | 'comment'>('saved')
  const [savedPosts, setSavedPosts] = useState<TypeSaved[]>([])
  const likedPosts: TypeSaved[] = []

  useEffect(() => {
    async function fetchSavedPosts() {
      try {
        const response = await getSavedPosts()
        setSavedPosts(response)
      } catch (error) {
        console.error('Erro ao buscar posts salvos:', error)
      }
    }
    fetchSavedPosts()
  }, [])

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
          onClick={() => setTab('saved')}
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
          onClick={() => setTab('liked')}
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
          onClick={() => setTab('comment')}
        >
          <MessageCircleMore className="h-5 w-5" />
          <span className="hidden sm:block">Comentários</span>
        </Button>
      </div>

      {/* Conteúdo das abas */}
      {tab === 'saved' && (
        <SavedPostList
          setOpenDialogPost={setOpenDialogPost}
          savedPosts={savedPosts}
          setPosts={setPosts}
        />
      )}
      {tab === 'liked' && (
        <LikedPostList likedPosts={likedPosts} setPosts={setPosts} />
      )}
      {tab === 'comment' && (
        <CommentedPostList posts={likedPosts} setPosts={setPosts} />
      )}
    </div>
  )
}

const SavedPostList = ({
  setOpenDialogPost,
  savedPosts,
  setPosts,
}: {
  setOpenDialogPost: Dispatch<SetStateAction<boolean>>
  savedPosts: TypeSaved[]
  setPosts: Dispatch<SetStateAction<Post[]>>
}) => {
  if (!savedPosts.length)
    return <EmptyState message="Nenhum vídeo salvo ainda." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {savedPosts.map((post) => (
        <PostCard
          key={post.id}
          setOpenDialogPost={setOpenDialogPost}
          posts={post.post}
          setPosts={setPosts}
        />
      ))}
    </div>
  )
}

const LikedPostList = ({
  likedPosts,
  setPosts,
}: {
  likedPosts: TypeSaved[]
  setPosts: Dispatch<SetStateAction<Post[]>>
}) => {
  if (!likedPosts.length)
    return <EmptyState message="Você ainda não curtiu nenhum vídeo." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {likedPosts.map((post) => (
        <PostCard key={post.id} posts={post.post} setPosts={setPosts} />
      ))}
    </div>
  )
}

const CommentedPostList = ({
  posts,
  setPosts,
}: {
  posts: TypeSaved[]
  setPosts: Dispatch<SetStateAction<Post[]>>
}) => {
  if (!posts.length)
    return <EmptyState message="Você ainda não comentou em nenhum vídeo." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} posts={post.post} setPosts={setPosts} />
      ))}
    </div>
  )
}

const PostCard = ({
  setOpenDialogPost,
  posts,
  setPosts,
}: {
  setOpenDialogPost?: Dispatch<SetStateAction<boolean>>
  posts: Post
  setPosts: Dispatch<SetStateAction<Post[]>>
}) => {
  return (
    <div
      onClick={() => {
        setPosts((prevPosts) => [...prevPosts, posts])
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
