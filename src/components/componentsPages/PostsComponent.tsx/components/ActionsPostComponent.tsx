import { Bookmark, Heart, Share2 } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/getMe'
import { usePosts } from '../../../../context/PostsContext'
import type { ExtendedPost } from '../../../../pages/community/PostsArchived'
import { savedPost, updateLikedPost } from '../../../../services/authService'
import type { Post } from '../../../../types'
import { TooltipComponent } from '../../../globalcomponents/tooltipComponent'
import { Button } from '../../../ui/button'
import DialogReportPost from '../DialogReportPost'
import PostComponentDialog from '../PostComponentDialog'

interface ActionsPostProps {
  valuePost: Post
  novoComentario: string
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  setPosts: React.Dispatch<React.SetStateAction<ExtendedPost[]>>
  posts: Post[]
  validated?: boolean
  pauseVideo: () => void
  open?: boolean
}

const ActionsPost = ({
  valuePost,
  novoComentario,
  setNovoComentario,
  setPosts,
  posts,
  open,
  // validated,
  pauseVideo,
}: ActionsPostProps) => {
  const navigate = useNavigate()
  const { setSelectedPost } = usePosts()
  const pathname = window.location.pathname
  const [openDialog, setOpenDialog] = useState(false)
  const [liked, setLiked] = useState(valuePost.likedByMe ?? false)
  const likesCount = valuePost._count?.likes ?? 0
  const { user: authUser } = useAuth()
  const validatedRouter = pathname.includes(`perfil/config`) ? true : false

  useEffect(() => {
    setLiked(valuePost.likedByMe ?? false)
  }, [valuePost])

  const handleShare = async () => {
    const shareData = {
      title: 'Post da Comunidade',
      text: 'Dá uma olhada neste post!',
      url: `${window.location.origin}/post/${valuePost.id}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        console.log('Compartilhado com sucesso!')
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert(
        'Seu navegador não suporta compartilhamento. O link do post foi copiado!'
      )
    }
  }

  const handleLiked = async (id: number) => {
    if (!authUser) {
      navigate('/auth')
    }
    const wasLiked = liked
    const currentLikes = likesCount
    const optimisticLikes = wasLiked ? currentLikes - 1 : currentLikes + 1
    setLiked(!wasLiked)
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likedByMe: !wasLiked,
              _count: {
                ...post._count,
                likes: optimisticLikes,
              },
            }
          : post
      )
    )
    setSelectedPost((prev) =>
      prev?.id === id
        ? {
            ...prev,
            likedByMe: !wasLiked,
            _count: {
              ...prev._count,
              likes: optimisticLikes,
            },
          }
        : prev
    )
    try {
      const updated = await updateLikedPost(id)
      if (!updated.ok) {
        setLiked(wasLiked)
        setPosts((prev) =>
          prev.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likedByMe: wasLiked,
                  _count: { ...post._count, likes: currentLikes },
                }
              : post
          )
        )
        return toast.error(updated.error || 'Ação não permitida', {
          icon: '🚫',
        })
      }
      setLiked(updated.liked)
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                likedByMe: updated.liked,
                _count: {
                  ...post._count,
                  likes: updated.likesCount,
                },
              }
            : post
        )
      )
      setSelectedPost((prev) =>
        prev?.id === id
          ? {
              ...prev,
              likedByMe: updated.liked,
              _count: {
                ...prev._count,
                likes: updated.likesCount,
              },
            }
          : prev
      )
    } catch (error) {
      setLiked(wasLiked)
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                likedByMe: wasLiked,
                _count: { ...post._count, likes: currentLikes },
              }
            : post
        )
      )
      const errorMsg = 'Erro ao curtir o post'
      toast.error(errorMsg, { icon: '🚫' })
    }
  }

  const handleSalvar = async (id: number) => {
    if (!authUser) {
      navigate('/auth')
    }
    const wasSaved = valuePost.saved
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, saved: !wasSaved } : post
      )
    )
    try {
      const response = await savedPost(id.toString())

      if (!response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === id ? { ...post, saved: wasSaved } : post
          )
        )
        return toast.error(response.error || 'Você não pode salvar esse post', {
          icon: '🚫',
        })
      }
      setPosts((prev) =>
        prev.map((post: ExtendedPost) =>
          post.id === id ? { ...post, saved: response.saved } : post
        )
      )
      setSelectedPost((prev) =>
        prev?.id === id ? { ...prev, saved: response.saved } : prev
      )
    } catch (error) {
      console.log(error)
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, saved: wasSaved } : post
        )
      )
      toast.error('Erro ao salvar o post')
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-1 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLiked(valuePost.id)}
            className={`flex items-center gap-1.5 px-2 text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 ${
              liked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>

          {!validatedRouter && !open && (
            <PostComponentDialog
              valuePosts={valuePost}
              novoComentario={novoComentario}
              setNovoComentario={setNovoComentario}
              setPosts={setPosts}
              posts={posts}
              open={openDialog}
              onOpenChange={
                setOpenDialog as Dispatch<SetStateAction<boolean | null>>
              }
              pauseVideo={pauseVideo}
            />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <Share2 className="h-5 w-5" />
            <span className="xs:inline hidden">Compartilhar</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {Number(valuePost.user.id) !== Number(authUser?.id) && (
            <DialogReportPost />
          )}

          <TooltipComponent
            description={valuePost.saved ? 'Desmarcar Post' : 'Salvar Post'}
          >
            <button
              onClick={() => handleSalvar(valuePost.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                valuePost.saved
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-200 dark:bg-purple-600 dark:shadow-none'
                  : 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30'
              }`}
            >
              <Bookmark
                className={`h-5 w-5 ${valuePost.saved ? 'fill-current' : ''}`}
              />
            </button>
          </TooltipComponent>
        </div>
      </div>
    </div>
  )
}

export default ActionsPost
